"use server";
import "use-server";

import db from "@repo/database/client";
import type { ExtendedSale, SaleListItem } from "@/types/entities/sales";
import { type Period, getPeriodDates } from "@/util/static";
import { getLoggedInUser } from "./users";

type getSalesFilter = {
  period: (typeof Period)[number];
  bankAccountId: string | undefined;
  page: number;
  limit: number;
  isCancelled: boolean;
};

export const getAllSales = async ({
  page = 1,
  limit = 1000,
  period,
  bankAccountId,
  isCancelled = false,
}: getSalesFilter): Promise<SaleListItem[]> => {
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

  const data = await db.sale.findMany({
    take: limit,
    skip: (page - 1) * limit,
    orderBy: {
      id: "desc",
    },
    where: {
      companyId: logInfo.company.id,
      isCancelled,
      bankAccountTransactions: bankAccountTransactionsFilter,
      createdAt: {
        gte: periodDates.startDate,
        lt: periodDates.endDate,
      },
    },
    include: {
      bankAccountTransactions: { include: { bankAccount: true } },
      customer: true,
    },
  });

  return data.map((sale) => ({
    id: sale.id,
    customerName: sale.customer.name,
    isReseller: sale.isReseller,
    createdAt: sale.createdAt,
    bankAccountName: sale.bankAccountTransactions[0]?.bankAccount.name,
    total: sale.total,
    isCancelled: sale.isCancelled,
  }));
};

export const getSale = async (id: number): Promise<ExtendedSale | null> => {
  const logInfo = await getLoggedInUser();
  if (!logInfo) return null;

  const sale = await db.sale.findUnique({
    where: {
      id: Number(id),
      companyId: logInfo.company.id,
    },
    include: {
      bankAccount: true,
      bankAccountTransactions: { include: { bankAccount: true } },
      customer: true,
      items: { include: { product: true, productSize: true } },
    },
  });

  if (!sale) return null;

  return sale;
};

export const currentMonthSales = async () => {
  const logInfo = await getLoggedInUser();
  if (!logInfo) return [];

  const data = await db.sale.findMany({
    where: {
      companyId: logInfo.company.id,
      createdAt: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      },
    },
  });
  return data;
};

export const compareCurrentMonthSalesWithLastMonth = async () => {
  const logInfo = await getLoggedInUser();
  if (!logInfo) return null;

  const currentMonthSales = await compareSalesFromDates(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  );

  const lastMonthSales = await compareSalesFromDates(
    new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    new Date(new Date().getFullYear(), new Date().getMonth(), 0)
  );

  let percentage = Math.round(
    ((currentMonthSales.total - lastMonthSales.total) / lastMonthSales.total) *
      100
  );

  if (Number.isNaN(percentage)) percentage = 0;
  if (lastMonthSales.total === 0) percentage = 0;

  if (lastMonthSales.total === 0 && currentMonthSales.total > 0)
    percentage = 100;

  return {
    currentMonthTotal: currentMonthSales.total,
    percentage,
  };
};

export const compareCurrentWeekSalesWithLastWeek = async () => {
  const logInfo = await getLoggedInUser();
  if (!logInfo) return null;

  const currentFromDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() - 7
  );
  const currentToDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() + 1
  );

  const lastFromDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() - 14
  );

  const lastToDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() - 6
  );

  const currentWeekSales = await compareSalesFromDates(
    currentFromDate,
    currentToDate
  );

  const lastWeekSales = await compareSalesFromDates(lastFromDate, lastToDate);

  let percentage = Math.round(
    ((currentWeekSales.total - lastWeekSales.total) / lastWeekSales.total) * 100
  );

  if (Number.isNaN(percentage)) percentage = 0;
  if (lastWeekSales.total === 0) percentage = 0;

  if (lastWeekSales.total === 0 && currentWeekSales.total > 0) percentage = 100;

  return {
    currentWeekTotal: currentWeekSales.total,
    percentage,
  };
};

export const compareSalesFromDates = async (startDate: Date, endDate: Date) => {
  const logInfo = await getLoggedInUser();
  if (!logInfo) return { data: [], total: 0 };
  const data = await db.sale.findMany({
    include: { items: true },
    where: {
      companyId: logInfo.company.id,
      isCancelled: false,
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
    },
  });

  const total = data.reduce((acc, item) => acc + item.total, 0);

  return { data, total };
};
