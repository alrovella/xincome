"use server";
import "use-server";

import db from "@repo/database/client";
import type { CartItem } from "@/types/types";
import { purchaseFormSchema } from "@/schemas/forms/purchase-form-schema";
import type { z } from "zod";
import { getLoggedInUser } from "../queries/users";

export const addPurchase = async (
  items: CartItem[],
  unsafeData: z.infer<typeof purchaseFormSchema>
) => {
  const logInfo = await getLoggedInUser();
  if (!logInfo) {
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos de la compra. Intenta nuevamente",
    };
  }

  const { success, data, error } = purchaseFormSchema.safeParse(unsafeData);

  if (!success || !data) {
    return {
      error: true,
      message: "Falta información para guardar la compra",
      fieldErrors: error.flatten().fieldErrors,
    };
  }

  const subTotal = items.reduce(
    (acc, item) => acc + item.productValue * item.quantity,
    0
  );
  const total = subTotal - (data.discount ?? 0);

  if (total < 0) {
    return {
      error: true,
      message: "El total de la compra no puede ser menor a 0",
    };
  }

  const bankAccountTransactions = data.bankAccountTransactions;

  const totalBankAccountTransactions = bankAccountTransactions.reduce(
    (acc, item) => acc + (item.amount ?? 0),
    0
  );

  if (total !== totalBankAccountTransactions) {
    return {
      error: true,
      message:
        "El total debe coincidir con el total de las asignaciones de cuentas bancarias",
    };
  }
  const purchase = await db.purchase.create({
    data: {
      companyId: logInfo.company.id,
      discount: data.discount,
      subTotal,
      total,
      comments: data.comments ?? "",
      supplierId: data.supplierId,
    },
  });

  if (!purchase) {
    return {
      error: true,
      message: "Hubo un error al querer crear la compra. Intenta nuevamente",
    };
  }

  for (const transaction of bankAccountTransactions) {
    if (transaction.amount && transaction.amount > 0) {
      await db.bankAccountTransaction.create({
        data: {
          companyId: logInfo.company.id,
          purchaseId: purchase.id,
          bankAccountId: transaction.bankAccountId,
          amount: transaction.amount,
        },
      });
    }
  }

  for (const item of items) {
    await db.purchaseItem.create({
      data: {
        purchaseId: purchase.id,
        productId: item.productId,
        productSizeId: item.productSizeId,
        cost: item.productValue,
        quantity: item.quantity,
      },
    });
  }

  return {
    error: false,
    message: "Compra guardada con exito",
  };
};
