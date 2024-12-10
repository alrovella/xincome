"use server";
import "use-server";

import db, { type WebServicesVisibility } from "@repo/database/client";
import type { z } from "zod";
import { getLoggedInUser } from "../queries/users";
import { companyFormSchema } from "@/schemas/forms/company-form-schema";

export const updateCompany = async (
  unsafeData: z.infer<typeof companyFormSchema>
) => {
  const user = await getLoggedInUser();
  if (!user)
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos de la empresa. Intenta nuevamente",
    };
  const { data, success, error } = companyFormSchema.safeParse(unsafeData);

  if (!success || !data) {
    const fieldErrorMessages = Object.entries(error.flatten().fieldErrors)
      .map(([field, errors]) => `${field}: ${errors?.join(", ")}`)
      .join("\n");

    return {
      error: true,
      message: `Falta información para guardar los datos de la empresa:\n ${fieldErrorMessages}`,
      fieldErrors: error.flatten().fieldErrors,
    };
  }

  const company = await db.company.update({
    where: { id: user.company.id },
    data: {
      name: data.name,
      welcomeText: data.welcomeText,
      slug: data.slug,
      instagram: data.instagram,
      facebook: data.facebook,
      address: data.address,
      city: data.city,
      province: data.province,
      country: data.country,
      phoneNumber: data.phoneNumber,
      whatsapp: data.whatsapp,
      email: data.email,
      logo: data.logo,
      headerImage: data.headerImage,
      options: {
        update: {
          showPersonInChargeReservation: data.showPersonInChargeReservation,
          canCreatePastAppointments: data.canCreatePastAppointments,
          webPayments: data.webPayments,
          webReservations: data.webReservations,
          webServicesVisibility:
            data.webServicesVisibility as WebServicesVisibility,
        },
      },
      companyCategory: data.companyCategoryId
        ? {
            connect: { id: data.companyCategoryId },
          }
        : {
            disconnect: true,
          },
    },
  });

  if (!company) {
    return {
      error: true,
      message:
        "Hubo un error al querer guardar los datos de la empresa. Intenta nuevamente",
    };
  }

  return {
    error: false,
    message: "Configuración guardada correctamente",
  };
};
