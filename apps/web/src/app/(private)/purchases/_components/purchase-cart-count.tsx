"use client";

import { usePurchaseStore } from "@/hooks/stores/usePurchaseStore";

export const PurchaseCartCount = () => {
  const { items } = usePurchaseStore();
  return items.length;
};
