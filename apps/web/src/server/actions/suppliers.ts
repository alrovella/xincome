"use server";
import "use-server";

import db from "@repo/database/client";
import { supplierFormSchema } from "@/schemas/forms/supplier-form-schema";
import type { z } from "zod";
import { getLoggedInUser } from "../queries/users";

export const addSupplier = async (
  unsafeData: z.infer<typeof supplierFormSchema>
) => {
  const user = await getLoggedInUser();
  if (!user)
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos del proveedor. Intenta nuevamente",
    };

  const { success, data, error } = supplierFormSchema.safeParse(unsafeData);

  if (!success || !data) {
    return {
      error: true,
      message: "Falta información para guardar el proveedor",
      fieldErrors: error.flatten().fieldErrors,
    };
  }

  const supplier = await db.supplier.create({
    data: {
      companyId: user.company.id,
      ...data,
    },
  });

  if (!supplier) {
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos del proveedor. Intenta nuevamente",
    };
  }

  return {
    error: false,
    message: "Proveedor guardado correctamente",
  };
};

export const updateSupplier = async (
  id: string,
  unsafeData: z.infer<typeof supplierFormSchema>
) => {
  const logInfo = await getLoggedInUser();
  if (!logInfo)
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos del proveedor. Intenta nuevamente",
    };

  const { success, data, error } = supplierFormSchema.safeParse(unsafeData);

  if (!success || !data) {
    return {
      error: true,
      message: "Falta información para guardar el proveedor",
      fieldErrors: error.flatten().fieldErrors,
    };
  }

  const supplier = await db.supplier.update({
    where: {
      id,
      companyId: logInfo.company.id,
    },
    data: {
      ...data,
    },
  });

  if (!supplier) {
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos del proveedor. Intenta nuevamente",
    };
  }

  return {
    error: false,
    message: "Proveedor guardado correctamente",
  };
};

export const deleteSupplier = async (id: string) => {
  const logInfo = await getLoggedInUser();

  if (!logInfo || !id)
    return {
      error: true,
      message:
        "Hubo un error al querer eliminar el proveedor. Intenta nuevamente",
    };

  const supplier = await db.supplier.update({
    where: {
      id,
      companyId: logInfo.company.id,
    },
    data: {
      deleted: true,
    },
  });

  if (!supplier) {
    return {
      error: true,
      message:
        "Hubo un error al querer eliminar el proveedor. Intenta nuevamente",
    };
  }

  return {
    error: false,
    message: "Proveedor eliminado correctamente",
  };
};
