"use server";
import "use-server";

import db, { type Customer } from "@repo/database/client";
import { getLoggedInUser } from "./users";
import type { RequentCustomer } from "@/types/entities/customers";
import type { PagedList } from "@/types/paged-list";

export const getAllCustomers = async (page = 1, limit = 10) => {
  const logInfo = await getLoggedInUser();

  if (!logInfo) return [];

  const data = await db.customer.findMany({
    where: { companyId: logInfo.company.id, deleted: false },
    orderBy: { name: "asc" },
    take: limit,
    skip: (page - 1) * limit,
  });
  return data;
};

export const getCustomer = async (id: string): Promise<Customer | null> => {
  if (!id) {
    return null;
  }

  const logInfo = await getLoggedInUser();

  if (!logInfo) return null;

  const data = await db.customer.findUnique({
    where: { id, deleted: false },
  });

  return data;
};

export const listCustomerItems = async () => {
  const logInfo = await getLoggedInUser();
  if (!logInfo) return [];

  const data = await db.customer.findMany({
    where: { companyId: logInfo.company.id, deleted: false },
    orderBy: { name: "asc" },
    take: 3,
    select: {
      id: true,
      name: true,
    },
  });

  return data.map((c) => ({
    label: c.name,
    value: String(c.id),
  }));
};

export async function getCustomers({
  serviceId,
  page,
  limit = 20,
}: {
  serviceId: string | null;
  page?: number | null;
  limit?: number;
}): Promise<PagedList<Customer>> {
  const user = await getLoggedInUser();
  if (!user) {
    return {
      data: [],
      totalCount: 0,
      page: page ?? 1,
      limit,
      totalPages: 0,
    };
  }
  if (!page) page = 1;
  const count = await db.customer.count({
    where: {
      deleted: false,
      companyId: user.company.id,
      appointments: serviceId
        ? {
            some: {
              serviceId,
            },
          }
        : undefined,
    },
  });
  const data = await db.customer.findMany({
    orderBy: {
      name: "asc",
    },
    take: limit,
    skip: (page - 1) * limit,
    where: {
      deleted: false,
      companyId: user.company.id,
      appointments: serviceId
        ? {
            some: {
              serviceId,
            },
          }
        : undefined,
    },
  });

  return {
    data,
    totalCount: count,
    page: page ?? 1,
    limit,
    totalPages: Math.ceil(count / limit),
  };
}

export async function getCustomerById({
  customerId,
}: {
  customerId: string;
}): Promise<Customer | null> {
  const user = await getLoggedInUser();
  if (!user) return null;

  const data = await db.customer.findFirst({
    where: {
      companyId: user.company.id,
      id: customerId,
      deleted: false,
    },
  });

  return data;
}

export async function getCurrentMonthCustomersBirthdates(): Promise<
  Customer[]
> {
  const user = await getLoggedInUser();
  if (!user) return [];

  const result = await db.$queryRaw`
    SELECT * 
    FROM "Customer"
    WHERE "deleted" = false AND "companyId" = ${user.company.id} AND EXTRACT(MONTH FROM "birthdate") = EXTRACT(MONTH FROM CURRENT_DATE);
  `;
  return result as Customer[];
}

export async function searchCustomers({
  searchValue,
}: {
  searchValue: string;
}) {
  if (searchValue === "") return [];
  const user = await getLoggedInUser();
  if (!user) return [];

  const data = await db.customer.findMany({
    where: {
      companyId: user.company.id,
      deleted: false,
      name: {
        contains: searchValue,
        mode: "insensitive",
      },
    },
  });

  return data.map((customer) => {
    return {
      label: customer.name,
      value: customer.id,
    };
  });
}

export async function getMostLoyalCustomers() {
  const user = await getLoggedInUser();
  if (!user) return [];

  const data = await db.customer.findMany({
    take: 5,
    where: {
      companyId: user.company.id,
      deleted: false,
      appointments: {
        some: {
          status: "CONFIRMADO",
        },
      },
    },
    orderBy: {
      appointments: {
        _count: "desc",
      },
    },
    select: {
      name: true,
      id: true,
      _count: true,
    },
  });
  return data as RequentCustomer[];
}

export async function customerAlreadyExists(
  phoneNumber: string
): Promise<boolean> {
  const user = await getLoggedInUser();

  if (!user) {
    return true;
  }

  const customer = await db.customer.count({
    where: {
      phoneNumber,
      companyId: user.company.id,
      deleted: false,
    },
  });
  return customer > 0;
}
