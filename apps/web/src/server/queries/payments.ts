"use server";
import "use-server";

import db, { type PaymentType } from "@repo/database/client";
import { getPeriodDates, type Period } from "@/util/static";
import { getLoggedInUser } from "./users";

type getPaymentsFilter = {
  paymentType: PaymentType;
  period?: (typeof Period)[number];
  bankAccountId: string | undefined;
  page: number;
  limit: number;
  isCancelled: boolean;
  appointmentId?: string;
};

export const getAllPayments = async ({
  page = 1,
  limit = 1000,
  period,
  bankAccountId,
  isCancelled = false,
  paymentType,
  appointmentId,
}: getPaymentsFilter) => {
  const logInfo = await getLoggedInUser();
  if (!logInfo) return [];

  const data = await db.payment.findMany({
    where: {
      companyId: logInfo.company?.id,
      isCancelled,
      type: paymentType,
      appointmentId,
      bankAccountTransactions: {
        some: {
          bankAccountId: !bankAccountId ? undefined : Number(bankAccountId),
        },
      },
      ...(period && {
        createdAt: {
          gte: getPeriodDates(period).startDate,
          lt: getPeriodDates(period).endDate,
        },
      }),
    },
    take: limit,
    skip: (page - 1) * limit,
    select: {
      id: true,
      createdAt: true,
      isCancelled: true,
      comments: true,
      title: true,
      amount: true,
      type: true,
      bankAccount: { select: { name: true } },
    },
  });

  return data;
};

export const getPayment = async (id?: string) => {
  if (!id) {
    return null;
  }

  const logInfo = await getLoggedInUser();
  if (!logInfo) return null;

  const data = await db.payment.findUnique({
    where: { id },
  });

  return data;
};
