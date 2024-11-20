import {
  Product,
  ProductCategory,
  ProductImage,
  Supplier,
} from "@repo/database";

export type ExtendedProduct = Product & {
  category: ProductCategory;
  supplier: Supplier;
  images?: ProductImage[];
};

export type ProductStock = {
  productId: number;
  productName: string;
  productCategoryName: string;
  productSizeName: string | undefined;
  totalPurchases: number;
  totalSales: number;
  stock: number;
};

export type ProductListItem = {
  id: number;
  name: string;
  supplierName: string;
  categoryName: string;
  price: number;
  resellerPrice: number;
  cost: number;
  hasSizes: boolean;
};
