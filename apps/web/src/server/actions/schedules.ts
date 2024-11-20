"use server";
import "use-server";

import db from "@repo/database/client";
import type { z } from "zod";
import { scheduleFormSchema } from "@/schemas/forms/schedule-form-schema";
import { getLoggedInUser } from "../queries/users";
import { createBusinessDate } from "@/util/utils";

export async function createSchedule(
  unsafeData: z.infer<typeof scheduleFormSchema>
) {
  const { data, success, error } = scheduleFormSchema.safeParse(unsafeData);
  const user = await getLoggedInUser();

  if (!user) {
    return {
      error: true,
      message: "El negocio no existe",
    };
  }

  if (!success || !data) {
    return {
      error: true,
      message: "Falta información para guardar la agenda",
      fieldErrors: error.flatten().fieldErrors,
    };
  }

  if (data.services.length === 0) {
    return {
      error: true,
      message: "Debes seleccionar al menos un servicio",
    };
  }

  if (data.businessHours.filter((c) => c.active).length === 0) {
    return {
      error: true,
      message: "Debes tener al menos un horario de atención activo",
    };
  }

  const schedule = await db.schedule.create({
    data: {
      name: data.name,
      active: data.active,
      companyId: user.company.id,
      minDaysInAdvance: data.minDaysInAdvance,
      maxDaysInAdvance: data.maxDaysInAdvance,
      personInCharge: data.personInCharge,
    },
  });

  for (const businessHour of data.businessHours) {
    if (businessHour.id) {
      await db.businessHour.update({
        where: {
          id: businessHour.id,
        },
        data: {
          dayOfWeek: businessHour.dayOfWeek,
          openTime: createBusinessDate(businessHour.openTime),
          closeTime: createBusinessDate(businessHour.closeTime),
          scheduleId: schedule.id,
          active: businessHour.active,
        },
      });
    } else {
      await db.businessHour.create({
        data: {
          companyId: user.company.id,
          dayOfWeek: businessHour.dayOfWeek,
          openTime: createBusinessDate(businessHour.openTime),
          closeTime: createBusinessDate(businessHour.closeTime),
          scheduleId: schedule.id,
          active: businessHour.active,
        },
      });
    }
  }

  await db.scheduleService.deleteMany({
    where: {
      scheduleId: schedule.id,
      serviceId: {
        notIn: data.services.map((service) => service.serviceId),
      },
    },
  });

  // // Agregar servicios que no existan en la base de datos
  await db.scheduleService.createMany({
    data: data.services.map((service) => ({
      scheduleId: schedule.id,
      serviceId: service.serviceId,
    })),
    skipDuplicates: true,
  });

  return {
    error: false,
    message: "Agenda guardada correctamente",
  };
}

export async function updateSchedule(
  id: string,
  unsafeData: z.infer<typeof scheduleFormSchema>
) {
  const { success, data, error } = scheduleFormSchema.safeParse(unsafeData);
  const user = await getLoggedInUser();

  if (!user) {
    return {
      error: true,
      message: "El negocio no existe",
    };
  }

  if (!success || !data) {
    return {
      error: true,
      message: "Falta información para guardar la agenda",
      fieldErrors: error.flatten().fieldErrors,
    };
  }

  if (data.services.length === 0) {
    return {
      error: true,
      message: "Debes seleccionar al menos un servicio",
    };
  }

  if (data.businessHours.filter((c) => c.active).length === 0) {
    return {
      error: true,
      message: "Debes tener al menos un horario de atención activo",
    };
  }

  const schedule = await db.schedule.update({
    where: {
      id,
      companyId: user.company.id,
    },
    data: {
      name: data.name,
      active: data.active,
      minDaysInAdvance: data.minDaysInAdvance,
      maxDaysInAdvance: data.maxDaysInAdvance,
      personInCharge: data.personInCharge,
    },
  });

  if (!schedule) {
    return {
      error: true,
      message: "Hubo un error al querer guardar la agenda. Intenta nuevamente",
    };
  }

  const businessHourIds = data.businessHours
    .map((businessHour) => businessHour.id)
    .filter((id): id is string => id !== undefined);

  // delete business hours that are not in the data
  await db.businessHour.deleteMany({
    where: {
      scheduleId: id,
      companyId: user.company.id,
      id: {
        notIn: businessHourIds,
      },
    },
  });

  for (const businessHour of data.businessHours) {
    if (businessHour.id) {
      await db.businessHour.update({
        where: {
          id: businessHour.id,
        },
        data: {
          dayOfWeek: businessHour.dayOfWeek,
          openTime: createBusinessDate(businessHour.openTime),
          closeTime: createBusinessDate(businessHour.closeTime),
          scheduleId: schedule.id,
          active: businessHour.active,
        },
      });
    } else {
      await db.businessHour.create({
        data: {
          companyId: user.company.id,
          dayOfWeek: businessHour.dayOfWeek,
          openTime: createBusinessDate(businessHour.openTime),
          closeTime: createBusinessDate(businessHour.closeTime),
          scheduleId: schedule.id,
          active: businessHour.active,
        },
      });
    }
  }

  await db.scheduleService.deleteMany({
    where: {
      scheduleId: id,
      serviceId: {
        notIn: data.services.map((service) => service.serviceId),
      },
    },
  });

  // // Agregar servicios que no existan en la base de datos
  await db.scheduleService.createMany({
    data: data.services.map((service) => ({
      scheduleId: id,
      serviceId: service.serviceId,
    })),
    skipDuplicates: true,
  });

  return {
    error: false,
    message: "Agenda actualizada correctamente",
  };
}

export async function deleteSchedule(id: string) {
  const user = await getLoggedInUser();

  if (!user) {
    return {
      error: true,
      message: "El negocio no existe",
    };
  }

  const schedule = await db.schedule.delete({
    where: {
      id,
      companyId: user.company.id,
    },
  });

  if (!schedule) {
    return {
      error: true,
      message: "Hubo un error al querer eliminar la agenda. Intenta nuevamente",
    };
  }
}
