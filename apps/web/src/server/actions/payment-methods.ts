"use server";
import "use-server";

import type { z } from "zod";
import db from "@repo/database/client";
import { paymentMethodSchema } from "@/schemas/forms/payment-method-form-schema";
import { getLoggedInUser } from "../queries/users";

export async function updatePaymentMethods(
  unsafeData: z.infer<typeof paymentMethodSchema>
) {
  const { data } = paymentMethodSchema.safeParse(unsafeData);
  const user = await getLoggedInUser();

  if (!data) {
    return {
      error: true,
      message: "Falta información para actualizar la configuración",
    };
  }

  if (!user) {
    return {
      error: true,
      message: "El usuario no tiene una cuenta",
    };
  }

  // Eliminar metodos de pago
  await db.companyPaymentMethod.deleteMany({
    where: {
      companyId: user.company.id,
      paymentMethodId: {
        notIn: data.paymentMethods.map((p) => p.paymentMethodId),
      },
    },
  });

  // // Agregar metodos de pago
  await db.companyPaymentMethod.createMany({
    data: data.paymentMethods.map((p) => ({
      companyId: user.company.id,
      paymentMethodId: p.paymentMethodId,
    })),
    skipDuplicates: true,
  });

  return {
    success: true,
    message: "Metodos de pago actualizados correctamente",
  };
}
