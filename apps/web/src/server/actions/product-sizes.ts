"use server";
import "use-server";

import db from "@repo/database/client";
import type { z } from "zod";
import { getLoggedInUser } from "../queries/users";
import { productSizeFormSchema } from "@/schemas/forms/productSize-form-schema";

export const addProductSize = async (
  unsafeData: z.infer<typeof productSizeFormSchema>
) => {
  const logInfo = await getLoggedInUser();
  if (!logInfo) {
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos del talle. Intenta nuevamente",
    };
  }
  const { success, data, error } = productSizeFormSchema.safeParse(unsafeData);

  if (!success || !data) {
    return {
      error: true,
      message: "Falta información para guardar el talle",
      fieldErrors: error.flatten().fieldErrors,
    };
  }

  const productSize = await db.productSize.create({
    data: { ...data, companyId: logInfo.company.id },
  });

  if (!productSize) {
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos del talle. Intenta nuevamente",
    };
  }

  return {
    error: false,
    message: "Talle guardado correctamente",
  };
};

export const updateProductSize = async (
  id: number,
  unsafeData: z.infer<typeof productSizeFormSchema>
) => {
  const logInfo = await getLoggedInUser();
  if (!logInfo) {
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos del talle. Intenta nuevamente",
    };
  }

  const { success, data, error } = productSizeFormSchema.safeParse(unsafeData);

  if (!success || !data) {
    return {
      error: true,
      message: "Falta información para guardar el talle",
      fieldErrors: error.flatten().fieldErrors,
    };
  }

  const productSize = await db.productSize.update({
    where: {
      id,
    },
    data,
  });

  if (!productSize) {
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos de el talle. Intenta nuevamente",
    };
  }

  return {
    error: false,
    message: "Talle guardado correctamente",
  };
};

export const deleteProductSize = async (id: number) => {
  const logInfo = await getLoggedInUser();
  if (!logInfo) {
    return {
      error: true,
      message: "Hubo un error al querer eliminar el talle. Intenta nuevamente",
    };
  }

  const productSize = await db.productSize.update({
    where: {
      id,
    },
    data: {
      deleted: true,
    },
  });

  if (!productSize) {
    return {
      error: true,
      message: "Hubo un error al querer eliminar el talle. Intenta nuevamente",
    };
  }

  return {
    error: false,
    message: "Talle eliminado correctamente",
  };
};
