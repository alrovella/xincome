"use server";
import "use-server";

import db from "@repo/database/client";
import type { z } from "zod";
import { bankAccountFormSchema } from "@/schemas/forms/bankAccount-form-schema";
import { getLoggedInUser } from "../queries/users";

export const addBankAccount = async (
  unsafeData: z.infer<typeof bankAccountFormSchema>
) => {
  const logInfo = await getLoggedInUser();
  if (!logInfo) {
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos de la cuenta bancaria. Intenta nuevamente",
    };
  }
  const { success, data, error } = bankAccountFormSchema.safeParse(unsafeData);

  if (!success || !data) {
    return {
      error: true,
      message: "Falta información para guardar la cuenta bancaria",
      fieldErrors: error.flatten().fieldErrors,
    };
  }

  const bankAccount = await db.bankAccount.create({
    data: {
      name: data.name,
      companyId: logInfo.company.id,
      cbu: data.cbu,
      alias: data.alias,
    },
  });

  if (!bankAccount) {
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos de la cuenta bancaria. Intenta nuevamente",
    };
  }

  return {
    error: false,
    message: "Cuenta Bancaria guardada correctamente",
  };
};

export const updateBankAccount = async (
  id: number,
  unsafeData: z.infer<typeof bankAccountFormSchema>
) => {
  const logInfo = await getLoggedInUser();
  if (!logInfo) {
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos de la cuenta bancaria. Intenta nuevamente",
    };
  }

  const { success, data, error } = bankAccountFormSchema.safeParse(unsafeData);

  if (!success || !data) {
    return {
      error: true,
      message: "Falta información para guardar la cuenta bancaria",
      fieldErrors: error.flatten().fieldErrors,
    };
  }

  const bankAccount = await db.bankAccount.update({
    where: {
      id,
    },
    data,
  });

  if (!bankAccount) {
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos de la cuenta bancaria. Intenta nuevamente",
    };
  }

  return {
    error: false,
    message: "Cuenta Bancaria guardada correctamente",
  };
};

export const deleteBankAccount = async (id: number) => {
  const logInfo = await getLoggedInUser();

  if (!logInfo || !id)
    return {
      error: true,
      message:
        "Hubo un error al querer eliminar la cuenta bancaria. Intenta nuevamente",
    };

  const bankAccount = await db.bankAccount.update({
    where: {
      id,
      companyId: logInfo.company.id,
    },
    data: {
      deleted: true,
    },
  });

  if (!bankAccount) {
    return {
      error: true,
      message:
        "Hubo un error al querer eliminar la cuenta bancaria. Intenta nuevamente",
    };
  }

  return {
    error: false,
    message: "Cuenta bancaria eliminada correctamente",
  };
};
