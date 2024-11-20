"use server";
import "use-server";

import db, { type Service } from "@repo/database/client";
import { getLoggedInUser } from "./users";

export async function getServices(): Promise<Service[]> {
  const user = await getLoggedInUser();
  if (!user) return [];

  const data = await db.service.findMany({
    orderBy: {
      name: "asc",
    },
    where: {
      deleted: false,
      companyId: user.company.id,
    },
  });

  return data;
}

export async function getServicesBySchedule(
  scheduleId: string
): Promise<Service[]> {
  const user = await getLoggedInUser();
  if (!user) return [];

  const data = await db.scheduleService.findMany({
    include: {
      service: true,
    },
    where: {
      scheduleId,
    },
  });

  return data.map((service) => service.service);
}

export async function getServiceById(id: string): Promise<Service | null> {
  const user = await getLoggedInUser();
  if (!user) return null;

  const data = await db.service.findFirst({
    where: { deleted: false, id, companyId: user.company.id },
  });

  return data;
}
