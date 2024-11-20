import {
  getAllProductSizes,
  getProductSize,
} from "@/server/queries/product-sizes";
import type { useQueryOptions } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export function useProductSizes() {
  const { isLoading, error, data, isRefetching, refetch } = useQuery({
    queryKey: ["getAllProductSizes"],
    queryFn: () => getAllProductSizes(),
    staleTime: 1800,
    gcTime: 1800,
  });

  return { isLoading, error, data, isRefetching, refetch };
}

type productSizeOptions = useQueryOptions & {
  id: number;
};

export function useProductSize({ id }: productSizeOptions) {
  const { isLoading, error, data } = useQuery({
    queryKey: ["getProductSize", id],
    queryFn: () => getProductSize(id),
  });

  return { isLoading, error, data };
}
