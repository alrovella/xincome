import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SaleVia } from "@repo/database";
import type { CartItem, SaleType } from "@/types/types";
import type { SaleStore } from "@/types/stores/SaleStore";

export const useSaleStore = create(
  persist<SaleStore>(
    (set, get) => ({
      saleType: "normal",
      via: SaleVia.PERSONAL,
      items: [],
      subTotal: 0,
      discount: 0,
      total: 0,
      supplierId: undefined,
      setSupplierId: (supplierId?: string) => {
        set((state) => {
          state.supplierId = supplierId;
          return {
            supplierId: state.supplierId,
          };
        });
      },
      setVia: (via: SaleVia) => {
        set((state) => {
          state.via = via;
          return {
            via: state.via,
          };
        });
      },
      setSaleType: (saleType: SaleType) => {
        set((state) => {
          state.saleType = saleType;
          return {
            saleType: state.saleType,
          };
        });
      },
      clearItems: () => {
        set((state) => {
          state.items = [];
          state.subTotal = 0;
          state.discount = 0;
          state.total = 0;
          state.supplierId = undefined;

          return {
            items: state.items,
            subTotal: state.subTotal,
            discount: state.discount,
            total: state.total,
            supplierId: state.supplierId,
          };
        });
      },
      setDiscount: (discount: number) => {
        set((state) => {
          if (Number.isNaN(discount)) {
            state.discount = 0;
          } else {
            state.discount = discount;
          }

          state.total = state.subTotal - discount;

          return {
            discount: state.discount,
            total: state.total,
          };
        });
      },
      addItem: (item: CartItem) => {
        set((state) => {
          const existingItem = state.items.find(
            (i) =>
              i.productId === item.productId &&
              i.productSizeId === item.productSizeId
          );

          if (existingItem) {
            existingItem.quantity += item.quantity;
            existingItem.total =
              existingItem.productValue * existingItem.quantity;
          } else {
            item.id = state.items.length + 1;
            item.total = item.productValue * item.quantity;
            state.items.push(item);
          }

          state.subTotal = state.items.reduce((acc, i) => acc + i.total, 0);
          state.total = state.subTotal - state.discount;

          return {
            items: state.items,
          };
        });
      },
      removeItem: (itemId: number) => {
        set((state) => {
          const item = state.items.find((i) => i.id === itemId);

          if (item) {
            state.items = state.items.filter((i) => i.id !== itemId);
            state.subTotal -= item.total;
            state.total = state.subTotal - state.discount;
          }

          if (state.items.length === 0) {
            state.discount = 0;
            state.total = 0;
          }

          return {
            items: state.items,
            subTotal: state.subTotal,
          };
        });
      },
      getStock: (productId: number, sizeId: number | undefined) => {
        const item = get().items.find(
          (i) => (i.productId === productId && i.productSizeId === sizeId) ?? ""
        );
        return item ? item.quantity : 0;
      },
    }),
    {
      name: "sale-cart-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
