"use server";
import "use-server";

import db, {
  type CompanyPaymentMethod,
  type PaymentMethod,
} from "@repo/database/client";
import { getLoggedInUser } from "./users";

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const count = await db.paymentMethod.count();
  if (count === 0) {
    await db.paymentMethod.createMany({
      data: [
        {
          name: "Efectivo",
        },
        {
          name: "Tarjeta de crédito",
        },
        {
          name: "Tarjeta de debito",
        },
        {
          name: "Transferencia",
        },
        {
          name: "Mercado Pago",
        },
      ],
    });
  }
  const data = await db.paymentMethod.findMany();
  return data;
}

export async function getPaymentMethodsByCompany(): Promise<
  CompanyPaymentMethod[]
> {
  const user = await getLoggedInUser();
  if (!user) return [];

  const data = await db.companyPaymentMethod.findMany({
    where: {
      companyId: user.company.id,
    },
  });

  return data;
}
