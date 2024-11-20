import {
  getAllCategories,
  getProductCategory,
} from "@/server/queries/product-categories";
import type { useQueryOptions } from "@/types/types";

import { useQuery } from "@tanstack/react-query";

export function useCategories() {
  const { isLoading, error, data, isRefetching, refetch } = useQuery({
    queryKey: ["getAllCategories"],
    queryFn: () => getAllCategories(),
    staleTime: 1800,
    gcTime: 1800,
  });

  return { isLoading, error, data, isRefetching, refetch };
}

type categoriesOptions = useQueryOptions & {
  id: number;
};

export function useCategory({ id }: categoriesOptions) {
  const { isLoading, error, data } = useQuery({
    queryKey: ["getCategory", id],
    queryFn: () => getProductCategory(id),
  });

  return { isLoading, error, data };
}
