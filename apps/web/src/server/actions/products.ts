"use server";
import "use-server";

import db from "@repo/database/client";
import { getLoggedInUser } from "../queries/users";
import type { z } from "zod";
import { productFormSchema } from "@/schemas/forms/product-form.schema";

export const addProduct = async (
  unsafeData: z.infer<typeof productFormSchema>
) => {
  const logInfo = await getLoggedInUser();
  if (!logInfo)
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos del producto. Intenta nuevamente",
    };

  const { data, success, error } = productFormSchema.safeParse(unsafeData);

  if (!success || !data) {
    return {
      error: true,
      message: "Falta información para guardar el producto",
      fieldErrors: error.flatten().fieldErrors,
    };
  }

  const product = await db.product.create({
    data: {
      ...data,
      companyId: logInfo.company.id,
    },
  });

  if (!product) {
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos del producto. Intenta nuevamente",
    };
  }

  return {
    error: false,
    message: "Producto guardado correctamente",
  };
};

export const updateProduct = async (
  id: number,
  unsafeData: z.infer<typeof productFormSchema>
) => {
  const logInfo = await getLoggedInUser();
  if (!logInfo)
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos del producto. Intenta nuevamente",
    };

  const { data, success, error } = productFormSchema.safeParse(unsafeData);

  if (!success || !data) {
    return {
      error: true,
      message: "Falta información para guardar el producto",
      fieldErrors: error.flatten().fieldErrors,
    };
  }

  const product = await db.product.update({
    where: { id },
    data: {
      ...data,
    },
  });

  if (!product) {
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos del producto. Intenta nuevamente",
    };
  }

  return {
    error: false,
    message: "Producto guardado correctamente",
  };
};

export const removeProductImage = async (
  productId: number,
  productImageId: string
) => {
  const logInfo = await getLoggedInUser();

  if (!logInfo) {
    return null;
  }
  await db.productImage.delete({
    where: {
      id: productImageId,
      productId,
      product: {
        companyId: logInfo.company.id,
      },
    },
  });
};

export const addProductImage = async (productId: number, url: string) => {
  const logInfo = await getLoggedInUser();

  if (!logInfo) {
    return null;
  }
  await db.productImage.create({
    data: {
      productId,
      url,
    },
  });
};

export const deleteProduct = async (id: number) => {
  const logInfo = await getLoggedInUser();

  if (!logInfo || !id)
    return {
      error: true,
      message:
        "Hubo un error al querer eliminar el producto. Intenta nuevamente",
    };

  const product = await db.product.update({
    where: {
      id,
      companyId: logInfo.company.id,
    },
    data: {
      deleted: true,
    },
  });

  if (!product) {
    return {
      error: true,
      message:
        "Hubo un error al querer eliminar el producto. Intenta nuevamente",
    };
  }

  return {
    error: false,
    message: "Producto eliminado correctamente",
  };
};
