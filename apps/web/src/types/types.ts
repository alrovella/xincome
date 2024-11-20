export type CartItem = {
  id: number;
  productId: number;
  productName: string;
  productSizeId?: number;
  productSizeName?: string;
  productValue: number;
  quantity: number;
  total: number;
};

export type SaleType = "normal" | "reseller";

export type useQueryOptions = {
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number;
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
};
