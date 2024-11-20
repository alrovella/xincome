"use server";
import "use-server";

import db from "@repo/database/client";
import type { BankAccountItem } from "@/types/entities/bank-accounts";
import { getLoggedInUser } from "./users";

export const getAllBankAccounts = async (
  page = 1,
  limit = 10
): Promise<BankAccountItem[]> => {
  const logInfo = await getLoggedInUser();
  if (!logInfo) return [];

  const data = await db.bankAccount.findMany({
    where: { companyId: logInfo.company.id, deleted: false },
    orderBy: { name: "asc" },
    take: limit,
    skip: (page - 1) * limit,
  });
  return data;
};

export const getBankAccount = async (id: number) => {
  const logInfo = await getLoggedInUser();
  if (!logInfo) return null;

  if (!id) {
    return null;
  }

  const data = await db.bankAccount.findUnique({
    where: { id: Number(id), companyId: logInfo.company.id, deleted: false },
  });

  return data;
};
