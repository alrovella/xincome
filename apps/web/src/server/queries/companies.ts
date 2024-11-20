"use server";
import "use-server";

import db, { type Company } from "@repo/database/client";
import type {
  ExtendedCompany,
  ExtendedCompanyForWeb,
} from "@/types/entities/companies";
import { getLoggedInUser } from "./users";

export async function getCompanyBySlug(
  slug: string
): Promise<ExtendedCompanyForWeb | null> {
  const data = await db.company.findFirst({
    include: {
      services: true,
      options: true,
      schedules: true,
      companyPlan: true,
      paymentMethods: {
        include: {
          paymentMethod: true,
        },
      },
    },
    where: {
      slug,
    },
  });

  if (!data) return null;
  const company = {
    ...data,
    paymentMethods: data.paymentMethods.map((p) => p.paymentMethod),
  } as ExtendedCompanyForWeb;

  return company;
}

export async function getCompanyById(id: string): Promise<Company | null> {
  const data = await db.company.findFirst({
    where: {
      id,
    },
  });

  return data;
}

export async function getLoggedInCompany(): Promise<ExtendedCompany | null> {
  const user = await getLoggedInUser();
  if (!user) return null;

  const data = await db.company.findFirst({
    where: {
      id: user.company.id,
    },
    include: {
      companyCategory: true,
      options: true,
      services: true,
      schedules: true,
      companyPlan: true,
    },
  });

  return data;
}
