"use server";
import "use-server";

import { MercadoPagoConfig, PreApproval } from "mercadopago";
import db from "@repo/database/client";
import { currentUser } from "@clerk/nextjs/server";
import { getLoggedInUser } from "../queries/users";
import type { CompanyPlanFormData } from "@/types/entities/companyPlans";
import { getPlanById } from "../queries/plans";
const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_SUBSCRIPTIONS_ACCESS_TOKEN ?? "",
});

export const setMercadoPagoPreApprovalId = async (preApprovalId: string) => {
  const user = await getLoggedInUser();
  if (!user) return null;

  await db.company.update({
    data: { mercadoPagoPreApprovalId: preApprovalId },
    where: { id: user.company?.id },
  });
};

export const subscribeToPlan = async (data: CompanyPlanFormData) => {
  const user = await currentUser();
  if (!user) throw new Error("Error");

  const companyPlan = await getPlanById(data.companyPlanId);
  //"test_user_40183539@testuser.com" test
  try {
    const suscription = await new PreApproval(mercadopago).create({
      body: {
        back_url: `${process.env.NEXT_PUBLIC_BASE_URL}/plans`,
        reason: `Suscripción a ${process.env.NEXT_PUBLIC_APP_NAME} para el plan ${companyPlan.name}`,
        payer_email: user?.emailAddresses[0]?.emailAddress,
        status: "pending",
        external_reference: companyPlan.id,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: companyPlan.price,
          currency_id: "ARS",
        },
      },
    });

    return {
      init_point: suscription.init_point,
      error: null,
    };
  } catch (error) {
    console.error(error);
    return {
      init_point: "",
      error:
        "Hubo un problema para realizar la suscripción. Intenta nuevamente o comunícate con soporte.",
    };
  }
};
