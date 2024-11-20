"use server";
import "use-server";

import db, { type CompanyPlan } from "@repo/database/client";

export async function getPlans(): Promise<CompanyPlan[]> {
  const data = await db.companyPlan.findMany({
    orderBy: {
      price: "asc",
    },
  });

  return data;
}

export async function getPlanById(companyPlanId: string): Promise<CompanyPlan> {
  const data = await db.companyPlan.findUnique({
    where: {
      id: companyPlanId,
    },
  });

  return data as CompanyPlan;
}
