"use client";

import { useSaleStore } from "@/hooks/stores/useSaleStore";

export const SaleCartCount = () => {
  const { items } = useSaleStore();
  return items.length;
};
