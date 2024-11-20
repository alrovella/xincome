import {
  getAllCustomers,
  getCustomer,
  listCustomerItems,
} from "@/server/queries/customers";
import type { useQueryOptions } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

type customersOptions = useQueryOptions & {
  page: number;
  limit: number;
};

export function useCustomers({ page, limit }: customersOptions) {
  const { isLoading, error, data, isRefetching, refetch } = useQuery({
    queryKey: ["getAllCustomers", page, limit],
    queryFn: () => getAllCustomers(page, limit),
  });

  return { isLoading, error, data, isRefetching, refetch };
}

type customerOptions = useQueryOptions & {
  id: string;
};

export function useCustomer({ id }: customerOptions) {
  const { isLoading, error, data } = useQuery({
    queryKey: ["getCustomer", id],
    queryFn: () => getCustomer(id),
  });

  return { isLoading, error, data };
}

export function useListCustomerItems() {
  const { data, refetch, isLoading, isError } = useQuery<
    {
      value: string;
      label: string;
    }[]
  >({
    queryKey: ["listCustomerItems"],
    queryFn: async () => {
      return await listCustomerItems();
    },
  });

  return { data, refetch, isLoading, isError };
}
