"use server";
import "use-server";

import db from "@repo/database/client";
import type { ProductStock } from "@/types/entities/products";
import { getLoggedInUser } from "./users";

export const getStockReport = async (): Promise<ProductStock[]> => {
  const logInfo = await getLoggedInUser();
  if (!logInfo) return [];

  const purchaseItems = await db.purchaseItem.groupBy({
    by: ["productId", "productSizeId"],
    _sum: {
      quantity: true,
    },
    where: {
      purchase: {
        companyId: logInfo.company.id,
      },
    },
  });

  const saleItems = await db.saleItem.groupBy({
    by: ["productId", "productSizeId"],
    _sum: {
      quantity: true,
    },
    where: {
      sale: {
        isCancelled: false,
        companyId: logInfo.company.id,
      },
    },
  });

  const stock: ProductStock[] = [];

  const products = await db.product.findMany({
    include: {
      category: true,
    },
    where: {
      companyId: logInfo.company.id,
      id: {
        in: purchaseItems.map((c) => c.productId),
      },
    },
  });

  const productSizes = await db.productSize.findMany({
    where: {
      companyId: logInfo.company.id,
    },
  });

  for (const purchaseItem of purchaseItems) {
    const product = products.find((c) => c.id === purchaseItem.productId);
    if (!product) {
      continue;
    }

    const saleItem = saleItems.find(
      (c) =>
        c.productId === purchaseItem.productId &&
        c.productSizeId === purchaseItem.productSizeId
    );

    const productSize = productSizes.find(
      (c) => c.id === purchaseItem.productSizeId
    );

    stock.push({
      productId: purchaseItem.productId,
      productCategoryName: product.category.name ?? "",
      productName: product.name ?? "",
      productSizeName: productSize?.name ?? "",
      totalPurchases: purchaseItem._sum.quantity ?? 0,
      totalSales: saleItem?._sum.quantity ?? 0,
      stock: (purchaseItem._sum.quantity ?? 0) - (saleItem?._sum.quantity ?? 0),
    });
  }

  return stock;
};
