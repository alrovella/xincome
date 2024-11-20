import type { CartItem } from "../types";

export type BaseStore = {
  items: CartItem[];
  clearItems: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: number) => void;
  setDiscount: (discount: number) => void;
  subTotal: number;
  discount: number;
  total: number;
  supplierId?: string;
  setSupplierId: (supplierId?: string) => void;
};
