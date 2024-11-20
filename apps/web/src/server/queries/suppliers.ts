"use server";
import "use-server";

import db from "@repo/database/client";
import type { SupplierItem } from "@/types/entities/suppliers";
import { getLoggedInUser } from "../queries/users";

export const getAllSuppliers = async (
  page = 1,
  limit = 10
): Promise<SupplierItem[] | null> => {
  const logInfo = await getLoggedInUser();
  if (!logInfo) return [];

  const data = await db.supplier.findMany({
    where: { companyId: logInfo.company.id, deleted: false },
    take: limit,
    skip: (page - 1) * limit,
    select: {
      id: true,
      name: true,
    },
  });

  return data;
};

export const getSupplier = async (id: string) => {
  if (!id) {
    return null;
  }

  const logInfo = await getLoggedInUser();
  if (!logInfo) return null;

  const data = await db.supplier.findFirst({
    where: { id, companyId: logInfo.company.id, deleted: false },
  });

  return data;
};
