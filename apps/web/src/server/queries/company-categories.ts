"use server";
import "use-server";

import db, { type CompanyCategory } from "@repo/database/client";
import { getLoggedInUser } from "./users";

export async function getWebCompanyCategories(): Promise<CompanyCategory[]> {
  const data = await db.companyCategory.findMany({
    where: {
      visibleInWeb: true,
    },
  });

  return data;
}

export async function getCompanyCategories(): Promise<CompanyCategory[]> {
  const data = await db.companyCategory.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return data;
}

export async function getCompanyCategory(): Promise<CompanyCategory | null> {
  const user = await getLoggedInUser();
  if (!user) return null;
  if (!user.company.companyCategoryId) return null;

  const data = await db.companyCategory.findFirst({
    where: { id: user.company.companyCategoryId },
  });

  return data as CompanyCategory;
}
