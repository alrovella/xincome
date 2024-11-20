import MercadoPagoConfig, { PreApproval } from "mercadopago";
import { NextResponse } from "next/server";
import db from "@repo/database/client";

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_SUBSCRIPTIONS_ACCESS_TOKEN ?? "",
});

export async function POST(req: Request) {
  const body = await req.json();

  if (body.data.type === "subscription_preapproval") {
    try {
      const suscription = await new PreApproval(mercadopago).get({
        id: body.data.id,
      });

      const companyPlanId = suscription.external_reference;
      ///suscription id: 74dcf065fc2a46d588756fe62779640c
      const company = await db.company.findFirst({
        where: {
          mercadoPagoPreApprovalId: suscription.id,
        },
      });

      if (suscription.status === "authorized") {
        await db.company.update({
          where: {
            id: company?.id,
          },
          data: {
            companyPlanId,
          },
        });
      } else {
        const freePlan = await db.companyPlan.findFirst({
          where: {
            price: 0,
          },
        });
        await db.company.update({
          where: {
            id: company?.id,
          },
          data: {
            companyPlanId: freePlan?.id,
          },
        });
      }

      return NextResponse.json({ status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({
        status: 404,
        message: "No existe la suscripción",
      });
    }
  }

  return NextResponse.json({
    status: 404,
    message: "Debe ser del type subscription_preapproval",
  });
}
