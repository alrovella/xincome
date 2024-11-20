"use server";
import "use-server";

import db from "@repo/database/client";
import { categoryFormSchema } from "@/schemas/forms/category-form-schema";
import type { z } from "zod";
import { getLoggedInUser } from "../queries/users";

export const addCategory = async (
  unsafeData: z.infer<typeof categoryFormSchema>
) => {
  const logInfo = await getLoggedInUser();

  if (!logInfo)
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos de la categoría. Intenta nuevamente",
    };

  const { success, data, error } = categoryFormSchema.safeParse(unsafeData);

  if (!success || !data) {
    return {
      error: true,
      message: "Falta información para guardar la categoría",
      fieldErrors: error.flatten().fieldErrors,
    };
  }

  const category = await db.productCategory.create({
    data: {
      name: data.name,
      companyId: logInfo.company.id,
    },
  });

  if (!category) {
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos de la categoría. Intenta nuevamente",
    };
  }

  return {
    error: false,
    message: "Categoría guardada correctamente",
  };
};

export const updateCategory = async (
  id: number,
  unsafeData: z.infer<typeof categoryFormSchema>
) => {
  const logInfo = await getLoggedInUser();

  if (!logInfo)
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos de la categoría. Intenta nuevamente",
    };

  const { success, data, error } = categoryFormSchema.safeParse(unsafeData);

  if (!success || !data) {
    return {
      error: true,
      message: "Falta información para guardar la categoría",
      fieldErrors: error.flatten().fieldErrors,
    };
  }

  const category = await db.productCategory.update({
    where: {
      id,
    },
    data,
  });

  if (!category) {
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos de la categoría. Intenta nuevamente",
    };
  }

  return {
    error: false,
    message: "Categoría guardada correctamente",
  };
};

export const deleteCategory = async (id: number) => {
  const logInfo = await getLoggedInUser();

  if (!logInfo || !id)
    return {
      error: true,
      message:
        "Hubo un error al querer eliminar la categoría. Intenta nuevamente",
    };

  const productCategory = await db.productCategory.update({
    where: {
      id,
      companyId: logInfo.company.id,
    },
    data: {
      deleted: true,
    },
  });

  if (!productCategory) {
    return {
      error: true,
      message:
        "Hubo un error al querer eliminar la categoría. Intenta nuevamente",
    };
  }

  return {
    error: false,
    message: "Categoría eliminada correctamente",
  };
};
