"use server";
import "use-server";

import db, { type BusinessHour } from "@repo/database/client";
import type {
  ScheduleExtended,
  ScheduleForWeb,
} from "@/types/entities/schedule";
import { getLoggedInUser } from "./users";
import { createBusinessHour } from "@/util/utils";

export async function getSchedulesForWeb(
  companyId: string
): Promise<ScheduleForWeb[]> {
  const data = await db.schedule.findMany({
    select: {
      id: true,
      name: true,
      services: {
        include: {
          service: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
    where: {
      companyId,
      active: true,
    },
  });

  const res = data.map((schedule) => {
    return {
      id: schedule.id,
      name: schedule.name,
      services: schedule.services.map((item) => {
        return {
          id: item.service.id,
          name: item.service.name,
          durationInMinutes: item.service.durationInMinutes,
          description: item.service.description,
          price: item.service.price,
        };
      }),
    };
  });

  return res;
}

export async function getSchedules(): Promise<ScheduleExtended[]> {
  const user = await getLoggedInUser();
  if (!user) return [];

  const data = await db.schedule.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      businessHours: true,
      services: true,
    },
    where: {
      companyId: user.company.id,
    },
  });

  return data;
}

export async function getSchedulesByService({
  serviceId,
}: {
  serviceId: string;
}): Promise<ScheduleExtended[]> {
  const user = await getLoggedInUser();
  if (!user) return [];

  const data = await db.schedule.findMany({
    include: {
      businessHours: {
        orderBy: {
          dayOfWeek: "asc",
        },
      },
      services: true,
    },
    where: {
      companyId: user.company.id,
      services: {
        some: {
          serviceId,
        },
      },
    },
  });

  return data;
}

export async function getScheduleById(
  scheduleId?: string | null
): Promise<ScheduleExtended | null> {
  const user = await getLoggedInUser();
  if (!user) return null;
  if (!scheduleId) return null;

  const data = await db.schedule.findFirst({
    include: {
      businessHours: {
        orderBy: {
          dayOfWeek: "asc",
        },
      },
      services: true,
    },
    where: {
      companyId: user.company.id,
      id: scheduleId,
    },
  });

  return data;
}

export async function getDefaultBusinessHours() {
  const openTime = createBusinessHour(9, 0);
  const closeTime = createBusinessHour(18, 0);

  const businessHours: Partial<BusinessHour>[] = [
    {
      active: true,
      dayOfWeek: 1, // LUNES
      openTime,
      closeTime,
    },
    {
      active: true,
      dayOfWeek: 2, // MARTES
      openTime,
      closeTime,
    },
    {
      active: true,
      dayOfWeek: 3, // MIERCOLES
      openTime,
      closeTime,
    },
    {
      active: true,
      dayOfWeek: 4, // JUEVES
      openTime,
      closeTime,
    },
    {
      active: true,
      dayOfWeek: 5, // VIERNES
      openTime,
      closeTime,
    },
    {
      active: false,
      dayOfWeek: 6, // SABADO
      openTime,
      closeTime,
    },
    {
      active: false,
      dayOfWeek: 0, // DOMINGO
      openTime,
      closeTime,
    },
  ];
  return businessHours;
}
