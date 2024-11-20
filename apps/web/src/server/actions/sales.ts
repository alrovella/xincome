"use server";
import "use-server";

import db from "@repo/database/client";
import type { CartItem } from "@/types/types";
import {
  saleEditFormSchema,
  saleFormSchema,
} from "@/schemas/forms/sale-form-schema";
import type { z } from "zod";
import { getLoggedInUser } from "../queries/users";

export const cancelSale = async (id: number) => {
  const user = await getLoggedInUser();
  if (!user) {
    return {
      error: true,
      message: "No se pudo cancelar la venta",
    };
  }

  await db.sale.update({
    where: {
      id,
    },
    data: {
      isCancelled: true,
    },
  });

  return {
    error: false,
    message: "Venta cancelada correctamente",
  };
};

export const updateSale = async (
  id: number,
  unsafeData: z.infer<typeof saleEditFormSchema>
) => {
  const logInfo = await getLoggedInUser();
  if (!logInfo)
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos de la venta. Intenta nuevamente",
    };
  const { data, success, error } = saleEditFormSchema.safeParse(unsafeData);

  if (!success || !data) {
    return {
      error: true,
      message: "Falta información para guardar la venta",
      fieldErrors: error.flatten().fieldErrors,
    };
  }

  const sale = await db.sale.update({
    where: { id },
    data,
  });

  if (!sale) {
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos de la venta. Intenta nuevamente",
    };
  }

  return {
    error: false,
    message: "Venta guardada correctamente",
  };
};

export const addSale = async (
  items: CartItem[],
  unsafeData: z.infer<typeof saleFormSchema>,
  isReseller = false
) => {
  const logInfo = await getLoggedInUser();
  if (!logInfo) {
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos de la venta. Intenta nuevamente",
    };
  }

  const { success, data, error } = saleFormSchema.safeParse(unsafeData);
  const discount = data?.discount ?? 0;
  const otherCharges = data?.otherCharges ?? 0;

  if (!success || !data) {
    return {
      error: true,
      message: "Falta información para guardar la venta",
      fieldErrors: error.flatten().fieldErrors,
    };
  }

  const subTotal = items.reduce(
    (acc, item) => acc + item.productValue * item.quantity,
    0
  );

  const sale = await db.sale.create({
    include: {
      items: true,
    },
    data: {
      companyId: logInfo.company.id,
      subTotal,
      discount,
      otherCharges,
      total: subTotal - discount - otherCharges,
      comments: data.comments ?? "",
      customerId: data.customerId,
      isReseller,
      via: data.via,
    },
  });

  for (const item of items) {
    await db.saleItem.create({
      data: {
        saleId: sale.id,
        productId: item.productId,
        productSizeId: item.productSizeId,
        price: item.productValue,
        quantity: item.quantity,
      },
    });
  }

  await db.bankAccountTransaction.create({
    data: {
      companyId: logInfo.company.id,
      bankAccountId: data.bankAccountId,
      amount: sale.total,
      saleId: sale.id,
    },
  });

  return {
    error: false,
    message: "La venta se ha realizado con exito!",
  };
};
