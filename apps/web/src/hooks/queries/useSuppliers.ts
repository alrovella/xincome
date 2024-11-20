import { getAllSuppliers, getSupplier } from "@/server/queries/suppliers";
import type { useQueryOptions } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export function useSuppliers() {
  const { isLoading, error, data, isRefetching, refetch } = useQuery({
    queryKey: ["getAllSuppliers"],
    queryFn: () => getAllSuppliers(),
    staleTime: 1800,
    gcTime: 1800,
  });

  return { isLoading, error, data, isRefetching, refetch };
}

type suppliersOptions = useQueryOptions & {
  id: string;
};

export function useSupplier({ id }: suppliersOptions) {
  const { isLoading, error, data } = useQuery({
    queryKey: ["getSupplier", id],
    queryFn: () => getSupplier(id),
  });

  return { isLoading, error, data };
}
