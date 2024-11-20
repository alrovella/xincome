import { searchCustomers } from "@/server/queries/customers";
import type { useQueryOptions } from "@/types/types";
import { sleep } from "@/util/utils";
import { useQuery } from "@tanstack/react-query";

type useSearchCustomerOptions = useQueryOptions & {
  searchValue: string;
};

export function useSearchCustomer({
  searchValue,
  enabled,
  staleTime,
}: useSearchCustomerOptions) {
  const { data, refetch, isLoading, isError } = useQuery<
    {
      label: string;
      value: string;
    }[]
  >({
    queryKey: ["searchCustomers", searchValue],
    queryFn: async ({ signal }) => {
      await sleep();

      if (!signal?.aborted) {
        return searchCustomers({ searchValue });
      }
      return [];
    },
    staleTime,
    enabled,
  });

  return { data, refetch, isLoading, isError };
}
