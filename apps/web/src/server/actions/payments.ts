"use server";
import "use-server";

import db, { ChargeStatus } from "@repo/database/client";
import type { z } from "zod";
import { getLoggedInUser } from "../queries/users";
import { paymentFormSchema } from "@/schemas/forms/payment-form-schema";

export const addPayment = async (
  unsafeData: z.infer<typeof paymentFormSchema>
) => {
  const user = await getLoggedInUser();
  if (!user)
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos del gasto. Intenta nuevamente",
    };

  const { data, success, error } = paymentFormSchema.safeParse(unsafeData);

  if (!success || !data) {
    return {
      error: true,
      message: "Falta información para guardar el pago",
      fieldErrors: error.flatten().fieldErrors,
    };
  }

  if (data.appointmentId) {
    const totalToPay = await db.appointment.findUnique({
      where: {
        id: data.appointmentId,
      },
      select: {
        totalToPay: true,
      },
    });

    if (!totalToPay) {
      return {
        error: true,
        message: "El turno no existe",
      };
    }

    const totalPayments = await db.payment.aggregate({
      where: {
        appointmentId: data.appointmentId,
        isCancelled: false,
      },
      _sum: {
        amount: true,
      },
    });

    const sum = (totalPayments._sum.amount ?? 0) + data.amount;

    if (sum > totalToPay?.totalToPay) {
      return {
        error: true,
        message: "El importe excede el total a cobrar del turno",
      };
    }
  }

  const payment = await db.payment.create({
    data: {
      ...data,
      companyId: user.company.id,
    },
    include: {
      appointment: true,
    },
  });

  if (!payment) {
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos del pago. Intenta nuevamente",
    };
  }

  // actualiza si el turno fue cobrado o no
  if (payment.appointment) {
    await updateChargedStatus(
      payment.appointment.id,
      payment.appointment.totalToPay
    );
  }

  await db.bankAccountTransaction.create({
    data: {
      companyId: user.company.id,
      bankAccountId: data.bankAccountId,
      amount: data.amount,
      paymentId: payment.id,
    },
  });

  return {
    error: false,
    message: "Pago guardado correctamente",
  };
};

export const updatePayment = async (
  id: string,
  unsafeData: z.infer<typeof paymentFormSchema>
) => {
  const logInfo = await getLoggedInUser();
  if (!logInfo)
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos del gasto. Intenta nuevamente",
    };
  const { data, success, error } = paymentFormSchema.safeParse(unsafeData);

  if (!success || !data) {
    return {
      error: true,
      message: "Falta información para guardar el gasto",
      fieldErrors: error.flatten().fieldErrors,
    };
  }

  const payment = await db.payment.update({
    where: { id },
    data,
  });

  if (!payment) {
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos del pago. Intenta nuevamente",
    };
  }

  return {
    error: false,
    message: "Pago guardado correctamente",
  };
};

export const cancelPayment = async (id: string) => {
  const user = await getLoggedInUser();
  if (!user) {
    return {
      error: true,
      message: "Hubo un error al querer cancelar el pago. Intenta nuevamente",
    };
  }

  const data = await db.payment.update({
    where: { id },
    data: {
      isCancelled: true,
    },
    include: {
      appointment: true,
    },
  });

  if (!data) {
    return {
      error: true,
      message: "Hubo un error al querer cancelar el pago. Intenta nuevamente",
    };
  }

  if (data.appointmentId && data.appointment) {
    // actualiza si el turno fue cobrado o no
    await updateChargedStatus(data.appointmentId, data.appointment.totalToPay);
  }

  return {
    error: false,
    message: "Pago cancelado correctamente",
  };
};

export async function updateChargedStatus(
  appointmentId: string,
  totalToPay: number
) {
  const totalPayments = await getTotalPayments(appointmentId);

  await db.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      chargeStatus: getChargeStatus(totalPayments, totalToPay),
    },
  });
}

function getChargeStatus(
  totalPayments: number,
  totalToPay: number
): ChargeStatus {
  if (totalPayments === totalToPay) {
    return ChargeStatus.COBRADO;
  }
  if (totalPayments > 0 && totalPayments < totalToPay) {
    return ChargeStatus.COBRADO_PARCIALMENTE;
  }
  return ChargeStatus.NO_COBRADO;
}

async function getTotalPayments(appointmentId: string) {
  const totalPayments = await db.payment.aggregate({
    where: {
      appointmentId: appointmentId,
      isCancelled: false,
    },
    _sum: {
      amount: true,
    },
  });

  return totalPayments._sum.amount ?? 0;
}
