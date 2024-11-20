import {
  getAllProducts,
  getProduct,
  getProductImages,
} from "@/server/queries/products";
import type { useQueryOptions } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

type productsOptions = useQueryOptions & {
  search?: string;
  supplierId?: string;
  page: number;
  limit: number;
};

export function useProducts({
  search,
  supplierId,
  page,
  limit,
}: productsOptions) {
  const { isLoading, error, data, isRefetching, refetch } = useQuery({
    queryKey: ["getAllProducts", search, supplierId, page, limit],
    queryFn: () => getAllProducts({ search, supplierId, page, limit }),
  });

  return { isLoading, error, data, isRefetching, refetch };
}

type productOption = useQueryOptions & {
  id: number;
};

export function useProduct({ id }: productOption) {
  const { isLoading, error, data } = useQuery({
    queryKey: ["getProduct", id],
    queryFn: () => getProduct(id),
  });

  return { isLoading, error, data };
}

export function useProductImages({ id }: productOption) {
  const { isLoading, error, data, refetch, isRefetching } = useQuery({
    queryKey: ["getProductImages", id],
    queryFn: () => getProductImages(id),
  });

  return { isLoading, error, data, refetch, isRefetching };
}
