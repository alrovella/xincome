"use server";
import "use-server";

import db from "@repo/database/client";
import { customerFormSchema } from "@/schemas/forms/customer-form-schema";
import type { z } from "zod";
import { customerAlreadyExists } from "../queries/customers";
import { getLoggedInUser } from "../queries/users";
import { cancelAppointmentsByCustomerId } from "./appointments";

export async function createCustomer(
  unsafeData: z.infer<typeof customerFormSchema>
) {
  const { data, success, error } = customerFormSchema.safeParse(unsafeData);
  const user = await getLoggedInUser();

  if (!user)
    return {
      error: true,
      message: "El usuario no tiene una empresa asignada",
    };

  if (!success || !data) {
    return {
      error: true,
      message: "Falta información para guardar el cliente",
      fieldErrors: error.flatten().fieldErrors,
    };
  }

  if (await customerAlreadyExists(data.phoneNumber)) {
    return {
      error: true,
      message: "El cliente ya se encuentra registrado en el sistema",
    };
  }

  const customer = await db.customer.create({
    data: {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      companyId: user.company.id,
      notes: data.notes,
      birthdate: data.birthdate
        ? new Date(
            new Date(data.birthdate).getFullYear(),
            new Date(data.birthdate).getMonth(),
            new Date(data.birthdate).getDate() + 1
          )
        : undefined,
    },
  });

  if (!customer) {
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos del cliente. Intenta nuevamente",
    };
  }

  return {
    error: false,
    message: "Cliente guardado correctamente",
  };
}

export async function updateCustomer(
  id: string,
  unsafeData: z.infer<typeof customerFormSchema>
) {
  const { success, data, error } = customerFormSchema.safeParse(unsafeData);
  const user = await getLoggedInUser();

  if (!user) {
    return {
      error: true,
      message: "El negocio no existe",
    };
  }

  if (!success || !data) {
    return {
      error: true,
      message: "Falta información para guardar el cliente",
      fieldErrors: error.flatten().fieldErrors,
    };
  }

  const customer = await db.customer.update({
    where: {
      id,
      companyId: user.company.id,
    },
    data: {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      notes: data.notes,
      birthdate: data.birthdate
        ? new Date(
            new Date(data.birthdate).getFullYear(),
            new Date(data.birthdate).getMonth(),
            new Date(data.birthdate).getDate() + 1
          )
        : undefined,
    },
  });

  if (!customer) {
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos del cliente. Intenta nuevamente",
    };
  }

  return {
    error: false,
    message: "Cliente actualizado correctamente",
  };
}

export const deleteCustomer = async (id: string) => {
  const logInfo = await getLoggedInUser();

  if (!logInfo || !id)
    return {
      error: true,
      message:
        "Hubo un error al querer eliminar el cliente. Intenta nuevamente",
    };

  const customer = await db.customer.update({
    where: {
      id,
      companyId: logInfo.company.id,
    },
    data: {
      deleted: true,
    },
  });

  await cancelAppointmentsByCustomerId(id);

  if (!customer) {
    return {
      error: true,
      message:
        "Hubo un error al querer eliminar el cliente. Intenta nuevamente",
    };
  }

  return {
    error: false,
    message: "Cliente eliminado correctamente",
  };
};
