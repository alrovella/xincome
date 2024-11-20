"use server";
import "use-server";
import db from "@repo/database/client";

import type { z } from "zod";
import { addMinutes } from "date-fns";
import {
  sendConfirmedAppointmentEmail,
  sendCreateAppointmentEmail,
} from "./resend";
import {
  checkAvailability,
  getTotalAppointmentByMonth,
} from "../queries/appointments";
import {
  appointmentFormSchema,
  customerAppointmentFormSchema,
} from "@/schemas/forms/appointment.form-schema";
import { getLoggedInUser } from "../queries/users";
import { AvailabilityStatus } from "@/types/entities/appointment";
import { getCompanyBySlug } from "../queries/companies";
import { combineDateAndTime } from "@/util/utils";
import { getServices } from "../queries/services";
import { updateChargedStatus } from "./payments";

export async function createAppointment({
  unsafeData,
  canCreatePastAppointments,
  showNoCreditsMessage,
}: {
  unsafeData: z.infer<typeof appointmentFormSchema>;
  canCreatePastAppointments: boolean;
  showNoCreditsMessage: boolean;
}) {
  const { data, success, error } = appointmentFormSchema.safeParse(unsafeData);
  const user = await getLoggedInUser();

  if (!user) {
    return {
      error: true,
      message: "El usuario no esta logueado o el negocio no existe",
    };
  }

  if (!success || !data) {
    return {
      error: true,
      message: "Falta información para guardar el turno",
      fieldErrors: error.flatten().fieldErrors,
    };
  }

  const services = await getServices();
  const service = services.find((service) => service.id === data.serviceId);

  if (!service) {
    return {
      error: true,
      message: "El servicio no existe",
    };
  }

  const totalAppointments = await getTotalAppointmentByMonth(
    data.scheduleId,
    data.fromDatetime
  );

  const companyPlan = await db.companyPlan.findFirst({
    where: {
      id: user.company.companyPlanId,
    },
  });

  if (
    companyPlan &&
    companyPlan.maxSppointmentsPerSchedule < totalAppointments
  ) {
    return {
      error: true,
      message: showNoCreditsMessage
        ? `No se pueden agregar mas turnos en esta agenda ya que se cubrió la cantidad total mensual según el plan contratado. Total del Plan: ${companyPlan.maxSppointmentsPerSchedule}. Total turnos del mes: ${totalAppointments}`
        : `No hemos podido procesar el turno, por favor comunicate con nosotros al ${user.company.whatsapp}`,
    };
  }

  const available = await checkAvailability({
    fromDatetime: data.fromDatetime,
    serviceId: data.serviceId,
    scheduleId: data.scheduleId,
    canCreatePastAppointments: canCreatePastAppointments ?? false,
  });

  if (
    available.status === AvailabilityStatus.Unavailable ||
    available.status === AvailabilityStatus.Unknown
  ) {
    return {
      error: true,
      message: "El horario de la fecha solicitada ya se encuentra ocupado",
    };
  }

  if (available.status === AvailabilityStatus.OutOfBusinessHours) {
    return {
      error: true,
      message:
        "El horario de la fecha solicitada esta fuera del horario de atención del negocio",
    };
  }

  if (available.status === AvailabilityStatus.PastDate) {
    return {
      error: true,
      message: "La fecha solicitada es pasada, intenta con otra fecha",
    };
  }

  // create customer (if not exists)
  let customer = await db.customer.findFirst({
    where: {
      phoneNumber: data.customerPhone,
      companyId: user.company.id,
    },
  });

  if (!customer && data.customerName && data.customerPhone) {
    customer = await db.customer.create({
      data: {
        name: data.customerName,
        phoneNumber: data.customerPhone,
        companyId: user.company.id,
      },
    });
  }

  const customerId = customer ? customer.id : (data.customerId as string);

  const appointment = await db.appointment.create({
    data: {
      scheduleId: data.scheduleId,
      privateNotes: data.privateNotes,
      publicNotes: data.publicNotes,
      customerId,
      companyId: user.company.id,
      userId: user.id,
      fromDatetime: new Date(data.fromDatetime),
      toDatetime: addMinutes(data.fromDatetime, service.durationInMinutes),
      serviceId: data.serviceId,
      totalToPay: data.totalToPay,
      status: "NO_CONFIRMADO",
    },
  });

  if (appointment && data.sendEmail && customer?.email) {
    await sendCreateAppointmentEmail(appointment.id);
  }

  return {
    error: false,
    message: "Turno guardado correctamente",
  };
}

export async function updateAppointment(
  id: string,
  unsafeData: z.infer<typeof appointmentFormSchema>
) {
  const { success, data, error } = appointmentFormSchema.safeParse(unsafeData);

  const user = await getLoggedInUser();

  if (!user) {
    return {
      error: true,
      message: "El usuario no esta logueado o el negocio no existe",
    };
  }

  if (!success || !data) {
    return {
      error: true,
      message: "Falta información para guardar el turno",
      fieldErrors: error.flatten().fieldErrors,
    };
  }

  const service = await db.service.findFirst({
    where: {
      id: data.serviceId,
    },
  });

  if (!service) {
    return {
      error: true,
      message: "El servicio solicitado no existe",
    };
  }

  const appointment = await db.appointment.update({
    where: {
      id,
      companyId: user.company.id,
    },
    data: {
      privateNotes: data.privateNotes,
      publicNotes: data.publicNotes,
      fromDatetime: new Date(data.fromDatetime),
      toDatetime: addMinutes(data.fromDatetime, service.durationInMinutes),
      serviceId: data.serviceId,
      totalToPay: data.totalToPay,
      cancellationReason: data.cancellationReason,
    },
  });

  if (!appointment) {
    return {
      error: true,
      message: "No se pudo actualizar el turno",
    };
  }

  await updateChargedStatus(appointment.id, appointment.totalToPay);

  return {
    error: false,
    message: "Turno actualizado correctamente",
  };
}

export async function cancelAppointmentsByCustomerId(id: string) {
  await db.appointment.updateMany({
    where: { customerId: id },
    data: { status: "CANCELADO" },
  });
}

export async function cancelAppointment(
  id: string,
  cancellationReason?: string
) {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      error: true,
      message: "El usuario no esta logueado o el negocio no existe",
    };
  }
  const canceled = await db.appointment.update({
    data: {
      status: "CANCELADO",
      cancellationReason,
    },
    where: {
      id,
      companyId: user.company.id,
    },
  });

  if (!canceled) {
    return {
      error: true,
      message: "No se pudo cancelar el turno",
    };
  }

  return {
    error: false,
    message: "Turno cancelado correctamente",
  };
}

export async function confirmAppointment(id: string, sendEmail = false) {
  const confirmed = await db.appointment.update({
    data: {
      status: "CONFIRMADO",
    },
    where: {
      id,
      status: "NO_CONFIRMADO",
    },
  });

  if (!confirmed) {
    return {
      error: true,
      message: "No se pudo confirmar el turno",
    };
  }

  if (confirmed && sendEmail) {
    sendConfirmedAppointmentEmail(id);
    return {
      error: false,
      message: "Turno confirmado correctamente",
    };
  }

  return {
    error: false,
    message: "Turno confirmado correctamente",
  };
}

export async function customerCancelAppointment(id: string) {
  await db.appointment.update({
    data: {
      status: "CANCELADO",
    },
    where: {
      id,
    },
  });
}

export async function createAppointmenByCustomer({
  unsafeData,
  slug,
}: {
  unsafeData: z.infer<typeof customerAppointmentFormSchema>;
  slug: string;
}) {
  const { data, success, error } =
    customerAppointmentFormSchema.safeParse(unsafeData);
  const company = await getCompanyBySlug(slug);

  if (!company) {
    return {
      error: true,
      message: "El usuario no esta logueado o el negocio no existe",
    };
  }

  if (!success || !data) {
    return {
      error: true,
      message: "Falta información para guardar el turno",
      fieldErrors: error.flatten().fieldErrors,
    };
  }

  const service = company.services.find(
    (service) => service.id === data.serviceId
  );

  if (!service) {
    return {
      error: true,
      message: "El servicio no existe",
    };
  }

  const fromDatetime = combineDateAndTime(data.date, data.time);

  const totalAppointments = await getTotalAppointmentByMonth(
    data.scheduleId,
    data.date
  );

  if (
    company.companyPlan &&
    company.companyPlan.maxSppointmentsPerSchedule < totalAppointments
  ) {
    return {
      error: true,
      message: `No hemos podido procesar el turno, por favor comunicate con nosotros al ${company.whatsapp}`,
    };
  }

  const available = await checkAvailability({
    fromDatetime,
    serviceId: data.serviceId,
    scheduleId: data.scheduleId,
    canCreatePastAppointments: false,
  });

  console.log(available);
  if (
    available.status === AvailabilityStatus.Unavailable ||
    available.status === AvailabilityStatus.Unknown
  ) {
    return {
      error: true,
      message: "El horario de la fecha solicitada ya se encuentra ocupado",
    };
  }

  if (available.status === AvailabilityStatus.OutOfBusinessHours) {
    return {
      error: true,
      message:
        "El horario de la fecha solicitada esta fuera del horario de atención del negocio",
    };
  }

  if (available.status === AvailabilityStatus.PastDate) {
    return {
      error: true,
      message: "La fecha solicitada es pasada, intenta con otra fecha",
    };
  }

  // create customer (if not exists)
  let customer = await db.customer.findFirst({
    where: {
      phoneNumber: data.customerPhone,
      companyId: company.id,
    },
  });

  if (!customer && data.customerName && data.customerPhone) {
    customer = await db.customer.create({
      data: {
        name: data.customerName,
        phoneNumber: data.customerPhone,
        companyId: company.id,
      },
    });
  }

  if (!customer) {
    return {
      error: true,
      message: "No se pudo crear el turno",
    };
  }

  const appointment = await db.appointment.create({
    data: {
      scheduleId: data.scheduleId,
      publicNotes: data.publicNotes,
      customerId: customer?.id,
      companyId: company.id,
      fromDatetime,
      toDatetime: addMinutes(fromDatetime, service.durationInMinutes),
      serviceId: data.serviceId,
      totalToPay: service.price,
      status: "NO_CONFIRMADO",
    },
  });

  if (!appointment) {
    return {
      error: true,
      message: "No se pudo crear el turno",
    };
  }
}
