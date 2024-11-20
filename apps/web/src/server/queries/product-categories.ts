"use server";
import "use-server";

import db from "@repo/database/client";
import { getLoggedInUser } from "../queries/users";

export const getAllCategories = async (page = 1, limit = 10) => {
  const logInfo = await getLoggedInUser();
  if (!logInfo) return [];

  const data = await db.productCategory.findMany({
    where: { companyId: logInfo.company.id, deleted: false },
    take: limit,
    skip: (page - 1) * limit,
  });

  return data;
};

export const getProductCategory = async (id: number) => {
  if (!id) {
    return null;
  }

  const logInfo = await getLoggedInUser();
  if (!logInfo) return null;

  const data = await db.productCategory.findUnique({
    where: { id: Number(id), companyId: logInfo.company.id, deleted: false },
  });

  return data;
};
