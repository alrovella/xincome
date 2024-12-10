"use server";
import "use-server";

import db from "@repo/database/client";
import { getPeriodDates, type Period } from "@/util/static";
import { getLoggedInUser } from "./users";
import type { PurchaseListItem } from "@/types/entities/purchases";

type getPurchasesFilter = {
  page: number;
  limit: number;
  period: (typeof Period)[number];
  bankAccountId?: number;
  supplierId?: string;
};

export const getAllPurchases = async (
  { page, limit, period, bankAccountId, supplierId }: getPurchasesFilter = {
    page: 1,
    limit: 10,
    period: "ESTEMES",
  }
): Promise<PurchaseListItem[]> => {
  const logInfo = await getLoggedInUser();
  if (!logInfo) return [];

  const periodDates = getPeriodDates(period);

  let bankAccountTransactionsFilter = {};
  if (bankAccountId !== undefined) {
    bankAccountTransactionsFilter = {
      some: {
        bankAccountId: bankAccountId,
      },
    };
  }

  const data = await db.purchase.findMany({
    take: limit,
    skip: (page - 1) * limit,
    orderBy: {
      createdAt: "desc",
    },
    where: {
      supplierId,
      companyId: logInfo.company.id,
      bankAccountTransactions: bankAccountTransactionsFilter,
      createdAt: {
        gte: periodDates.startDate,
        lt: periodDates.endDate,
      },
    },
    include: {
      bankAccountTransactions: { include: { bankAccount: true } },
      supplier: true,
    },
  });

  return data.map((purchase) => ({
    id: purchase.id,
    supplierName: purchase.supplier.name,
    createdAt: purchase.createdAt,
    bankAccountTransactions: purchase.bankAccountTransactions,
    subTotal: purchase.subTotal,
    discount: purchase.discount,
    total: purchase.total,
  }));
};

export const getPurchase = async (id: number) => {
  const logInfo = await getLoggedInUser();
  if (!logInfo) return null;

  const data = await db.purchase.findUnique({
    where: {
      id: Number(id),
      companyId: logInfo.company.id,
    },
    include: {
      bankAccountTransactions: { include: { bankAccount: true } },
      supplier: true,
      items: { include: { product: true, productSize: true } },
    },
  });

  return data;
};
