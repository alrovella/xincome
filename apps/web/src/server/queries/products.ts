"use server";
import "use-server";

import db from "@repo/database/client";
import type { ProductListItem } from "@/types/entities/products";
import { getLoggedInUser } from "./users";
import type { PagedList } from "@/types/paged-list";

type getAllProductsFilter = {
  search?: string;
  supplierId?: string;
  page: number;
  limit: number;
};

export const getAllProducts = async ({
  search,
  supplierId,
  page,
  limit,
}: getAllProductsFilter): Promise<PagedList<ProductListItem>> => {
  const logInfo = await getLoggedInUser();
  if (!logInfo) return { data: [], totalCount: 0, totalPages: 1, page, limit };

  const count = await db.product.count({
    where: {
      deleted: false,
      name: { contains: search, mode: "insensitive" },
      supplierId:
        supplierId !== undefined ? { equals: String(supplierId) } : undefined,
    },
  });

  const data = await db.product.findMany({
    where: {
      deleted: false,
      name: { contains: search, mode: "insensitive" },
      supplierId:
        supplierId !== undefined ? { equals: String(supplierId) } : undefined,
    },
    include: { category: true, supplier: true },
    take: limit,
    skip: limit * (page - 1),
  });

  const products = data.map((p) => ({
    supplierName: p.supplier.name,
    id: p.id,
    name: p.name,
    categoryName: p.category.name,
    price: p.price,
    resellerPrice: p.resellerPrice,
    cost: p.cost,
    hasSizes: p.hasSizes,
  })) as ProductListItem[];

  return {
    data: products,
    totalCount: count,
    totalPages: Math.ceil(count / limit) ?? 1,
    limit,
    page,
  };
};

export const getProduct = async (id: number) => {
  const logInfo = await getLoggedInUser();
  if (!logInfo) return null;

  if (!id) {
    return null;
  }

  const data = await db.product.findUnique({
    where: { deleted: false, id: Number(id), companyId: logInfo.company.id },
  });

  return data;
};

export const getProductImages = async (id: number) => {
  const logInfo = await getLoggedInUser();
  if (!logInfo) return null;

  if (!id) {
    return null;
  }

  const data = await db.productImage.findMany({
    where: {
      productId: Number(id),
      product: { companyId: logInfo.company.id },
    },
  });

  return data;
};

export const getProductStock = async (productId: number, sizeId?: number) => {
  const logInfo = await getLoggedInUser();

  if (!logInfo) {
    return 0;
  }

  const product = await db.product.findUnique({
    include: {
      purchaseItems: true,
      saleItems: {
        include: { sale: true },
      },
    },
    where: {
      id: productId,
      companyId: logInfo.company.id,
    },
  });

  const purchaseItems = product?.purchaseItems
    .filter((c) => (sizeId ? c.productSizeId === sizeId : true))
    .reduce((acc, item) => item.quantity + acc, 0);

  const saleItems = product?.saleItems
    .filter(
      (c) =>
        !c.sale?.isCancelled && (sizeId ? c.productSizeId === sizeId : true)
    )
    .reduce((acc, item) => item.quantity + acc, 0);

  return (purchaseItems ?? 0) - (saleItems ?? 0);
};
