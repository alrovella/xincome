import type { SaleVia } from "@repo/database";
import type { SaleType } from "../types";
import type { BaseStore } from "./BaseStore";

export type SaleStore = BaseStore & {
  saleType?: SaleType;
  via: SaleVia;
  getStock: (productId: number, sizeId: number | undefined) => number;
  setSaleType: (saleType: SaleType) => void;
  setVia: (via: SaleVia) => void;
};
