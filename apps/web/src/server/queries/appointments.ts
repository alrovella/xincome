"use server";
import "use-server";

import db, { type Appointment } from "@repo/database/client";
import {
  addMinutes,
  addMonths,
  endOfDay,
  endOfMonth,
  endOfWeek,
  isAfter,
  isBefore,
  set,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import {
  type AppointmentsFilter,
  AvailabilityStatus,
  type ExtendedAppointment,
} from "@/types/entities/appointment";
import { getLoggedInUser } from "./users";
import type {
  ScheduleAvailabilityResult,
  ScheduleExtended,
} from "@/types/entities/schedule";
import { getScheduleById, getSchedulesByService } from "./schedules";
import { getServices } from "./services";

export async function getAppointments(
  filter: AppointmentsFilter
): Promise<ExtendedAppointment[]> {
  const user = await getLoggedInUser();
  if (!user) return [];

  const { status, period, customerName, chargeStatus, scheduleId } = filter;

  let from = startOfDay(new Date());
  let to = endOfDay(new Date());

  if (period === "MES") {
    from = startOfMonth(new Date());
    to = endOfMonth(new Date());
  } else if (period === "SEMANA") {
    from = startOfWeek(new Date());
    to = endOfWeek(new Date());
  } else if (period === "MESPASADO") {
    from = startOfMonth(addMonths(new Date(), -1));
    to = endOfMonth(addMonths(new Date(), -1));
  } else if (period === "ULTIMOS3MESES") {
    from = startOfMonth(addMonths(new Date(), -3));
    to = endOfMonth(new Date());
  } else if (period === "PROXIMOS3MESES") {
    from = startOfMonth(new Date());
    to = endOfMonth(addMonths(from, 3));
  } else if (period === "HOY") {
    from = startOfDay(new Date());
    to = endOfDay(new Date());
  } else if (period === "PROXIMOMES") {
    from = startOfMonth(addMonths(new Date(), 1));
    to = endOfMonth(addMonths(from, 1));
  }

  const data = await db.appointment.findMany({
    where: {
      companyId: user.company.id,
      status: status ? { equals: status } : undefined,
      scheduleId: scheduleId ? { equals: scheduleId } : undefined,
      chargeStatus: chargeStatus ? { equals: chargeStatus } : undefined,
      fromDatetime: {
        gte: from,
        lte: to,
      },
      customer: {
        name: customerName
          ? { contains: customerName, mode: "insensitive" }
          : undefined,
      },
    },
    orderBy: {
      fromDatetime: "asc",
    },
    include: {
      service: true,
      schedule: true,
      customer: true,
    },
  });

  return data;
}

export async function getAppointmentById(
  id: string
): Promise<ExtendedAppointment | null> {
  const user = await getLoggedInUser();
  if (!user) return null;

  const data = await db.appointment.findUnique({
    where: {
      id,
      companyId: user.company.id,
    },
    include: {
      service: true,
      customer: true,
      schedule: true,
    },
  });

  return data;
}

export async function getLastConfirmedAppointmentsByCustomerById(
  customerId: string
): Promise<ExtendedAppointment[]> {
  const user = await getLoggedInUser();
  if (!user) return [];

  const data = await db.appointment.findMany({
    include: {
      service: true,
      customer: true,
      schedule: true,
    },
    where: {
      customerId,
      companyId: user.company.id,
    },
    orderBy: {
      fromDatetime: "desc",
    },
    take: 5,
  });

  return data;
}

export async function getAppointmentsIncomeByDates(
  from: Date,
  to: Date
): Promise<number> {
  const user = await getLoggedInUser();
  if (!user) return 0;

  const data = await db.appointment.aggregate({
    where: {
      companyId: user.company.id,
      status: { equals: "CONFIRMADO" },
      fromDatetime: {
        gte: from,
        lte: to,
      },
    },
    _sum: { totalToPay: true },
  });

  return data._sum.totalToPay ?? 0;
}

export async function checkAvailability({
  fromDatetime,
  serviceId,
  scheduleId,
  canCreatePastAppointments,
}: {
  fromDatetime: Date;
  serviceId: string;
  scheduleId: string | null;
  canCreatePastAppointments: boolean;
}): Promise<ScheduleAvailabilityResult> {
  const user = await getLoggedInUser();

  const services = await getServices();
  if (!user || services.length === 0)
    return { scheduleId, status: AvailabilityStatus.Unavailable };

  if (!canCreatePastAppointments && fromDatetime < new Date())
    return { scheduleId, status: AvailabilityStatus.PastDate };

  const possibleSchedules = (
    scheduleId
      ? [await getScheduleById(scheduleId)]
      : getSchedulesByService({ serviceId })
  ) as ScheduleExtended[];

  const durationInMinutes =
    services.find((s) => s.id === serviceId)?.durationInMinutes ?? 0;

  if (durationInMinutes === 0)
    return {
      scheduleId: scheduleId,
      status: AvailabilityStatus.Unavailable,
    };

  const toDateTime = addMinutes(fromDatetime, durationInMinutes);

  const schedulesAvailabilities: {
    scheduleId: string | undefined;
    status: AvailabilityStatus;
  }[] = [];

  // check business hours before checking availability
  const businessHourstatus = await checkBusinessHour(
    fromDatetime,
    user.company.id
  );
  if (businessHourstatus === AvailabilityStatus.OutOfBusinessHours) {
    return {
      scheduleId: scheduleId,
      status: AvailabilityStatus.OutOfBusinessHours,
    };
  }

  for (const schedule of possibleSchedules) {
    const overlappingAppointments = await getOverlappingAppointments({
      scheduleId: schedule?.id,
      companyId: user.company.id,
      fromDatetime,
      toDateTime,
    });

    schedulesAvailabilities.push({
      scheduleId: schedule?.id,
      status:
        overlappingAppointments.length > 0
          ? AvailabilityStatus.Unavailable
          : AvailabilityStatus.Available,
    });
  }

  const isAvailable = schedulesAvailabilities.find(
    (s) => s.status === AvailabilityStatus.Available
  );

  return isAvailable?.scheduleId
    ? { scheduleId: isAvailable.scheduleId, status: isAvailable.status }
    : { scheduleId, status: AvailabilityStatus.Unavailable };
}

async function getOverlappingAppointments({
  scheduleId,
  companyId,
  fromDatetime,
  toDateTime,
}: {
  scheduleId: string | null;
  companyId: string;
  fromDatetime: Date;
  toDateTime: Date;
}): Promise<Appointment[]> {
  const overlappingAppointments = await db.appointment.findMany({
    where: {
      scheduleId: scheduleId ?? undefined,
      companyId: companyId,
      NOT: {
        OR: [
          // La nueva cita termina antes de que comience la existente.
          {
            toDatetime: { lte: fromDatetime },
          },
          // La nueva cita comienza después de que termine la existente.
          {
            fromDatetime: { gte: toDateTime },
          },
        ],
      },
    },
  });

  return overlappingAppointments ?? [];
}

async function checkBusinessHour(userSelectedDate: Date, companyId: string) {
  const selectedDate = new Date(userSelectedDate);
  const dayOfWeek = selectedDate.getDay(); // Cambiar a getDay para horario local si es necesario

  // Buscar todos los horarios de atención para el día seleccionado
  const businessHours = await db.businessHour.findMany({
    where: {
      companyId,
      dayOfWeek,
      active: true,
    },
  });

  if (businessHours.length === 0) {
    return AvailabilityStatus.OutOfBusinessHours;
  }

  // Iterar sobre todos los horarios y verificar si alguno coincide
  for (const businessHour of businessHours) {
    const { openTime, closeTime } = businessHour;

    // Establecer la hora de apertura y cierre con la misma fecha del usuario
    const openTimeDate = set(selectedDate, {
      hours: openTime.getHours(),
      minutes: openTime.getMinutes(),
      seconds: 0,
      milliseconds: 0,
    });

    const closeTimeDate = set(selectedDate, {
      hours: closeTime.getHours(),
      minutes: closeTime.getMinutes(),
      seconds: 0,
      milliseconds: 0,
    });

    // Comparar la hora seleccionada con las horas de apertura y cierre
    if (
      !isBefore(selectedDate, openTimeDate) &&
      !isAfter(selectedDate, closeTimeDate)
    ) {
      // Si la hora está dentro de los horarios de atención, está disponible
      return AvailabilityStatus.Available;
    }
  }

  // Si ninguna de las franjas horarias coincide, está fuera del horario de atención
  return AvailabilityStatus.OutOfBusinessHours;
}

export async function getTotalAppointmentByMonth(
  scheduleId: string,
  fromDateTime: Date
) {
  const user = await getLoggedInUser();
  if (!user) return 0;

  const count = await db.appointment.aggregate({
    _count: true,
    where: {
      companyId: user.company.id,
      scheduleId: scheduleId,
      status: {
        notIn: ["CANCELADO"],
      },
      fromDatetime: {
        gte: startOfMonth(fromDateTime),
        lte: endOfMonth(fromDateTime),
      },
    },
  });

  return count._count;
}
