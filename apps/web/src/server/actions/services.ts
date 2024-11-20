"use server";
import "use-server";

import db from "@repo/database/client";
import type { z } from "zod";
import { serviceFormSchema } from "@/schemas/forms/service-form-schema";
import { getLoggedInUser } from "../queries/users";

export async function createService(
  unsafeData: z.infer<typeof serviceFormSchema>
) {
  const { data, success, error } = serviceFormSchema.safeParse(unsafeData);
  const user = await getLoggedInUser();

  if (!user) {
    return {
      error: true,
      message: "Empresa no encontrada",
    };
  }

  if (!success || !data) {
    return {
      error: true,
      message: "Falta información para guardar el servicio",
      fieldErrors: error.flatten().fieldErrors,
    };
  }

  const service = await db.service.create({
    data: {
      name: data.name,
      companyId: user.company.id,
      description: data.description,
      price: data.price,
      durationInMinutes: data.durationInMinutes,
    },
  });

  if (!service) {
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos del servicio. Intenta nuevamente",
    };
  }

  return {
    error: false,
    message: "Servicio guardado correctamente. Recordá agregarlo a la agenda",
  };
}

export async function updateService(
  id: string,
  unsafeData: z.infer<typeof serviceFormSchema>
) {
  const { success, data, error } = serviceFormSchema.safeParse(unsafeData);
  const user = await getLoggedInUser();

  if (!user)
    return {
      error: true,
      message: "El usuario no tiene una empresa asignada",
    };

  if (!success || !data) {
    return {
      error: true,
      message: "Falta información para guardar el servicio",
      fieldErrors: error.flatten().fieldErrors,
    };
  }

  const service = await db.service.update({
    where: {
      id,
      companyId: user.company.id,
    },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      durationInMinutes: data.durationInMinutes,
    },
  });

  if (!service) {
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos del servicio. Intenta nuevamente",
    };
  }

  return {
    error: false,
    message: "Servicio actualizado correctamente",
  };
}

export const deleteService = async (id: string) => {
  const logInfo = await getLoggedInUser();

  if (!logInfo || !id)
    return {
      error: true,
      message:
        "Hubo un error al querer eliminar el servicio. Intenta nuevamente",
    };

  const service = await db.service.update({
    where: {
      id,
      companyId: logInfo.company.id,
    },
    data: {
      deleted: true,
    },
  });

  if (!service) {
    return {
      error: true,
      message:
        "Hubo un error al querer eliminar el servicio. Intenta nuevamente",
    };
  }

  return {
    error: false,
    message: "Servicio eliminado correctamente",
  };
};
