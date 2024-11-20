import type { PurchaseStore } from "@/types/stores/PurchaseStore";
import type { CartItem } from "@/types/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const usePurchaseStore = create(
  persist<PurchaseStore>(
    (set) => ({
      items: [],
      subTotal: 0,
      discount: 0,
      total: 0,
      supplierId: undefined,
      setSupplierId: (supplierId?: string) => {
        set((state) => {
          state.supplierId = supplierId;

          if (supplierId !== state.supplierId) {
            state.clearItems();
          }

          return {
            supplierId: state.supplierId,
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
    }),
    {
      name: "purchase-cart-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
