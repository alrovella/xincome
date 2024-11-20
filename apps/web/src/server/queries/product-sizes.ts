"use server";
import "use-server";

import db, { type ProductSize } from "@repo/database/client";
import { getLoggedInUser } from "./users";

export const getAllProductSizes = async (
  page = 1,
  limit = 10
): Promise<ProductSize[]> => {
  const logInfo = await getLoggedInUser();
  if (!logInfo) return [];

  const data = await db.productSize.findMany({
    where: {
      deleted: false,
    },
    take: limit,
    skip: (page - 1) * limit,
  });
  return data;
};

export const getProductSize = async (id: number) => {
  const logInfo = await getLoggedInUser();
  if (!logInfo) return null;

  if (!id) {
    return null;
  }

  const data = await db.productSize.findUnique({
    where: { id: Number(id), deleted: false },
  });

  return data;
};
