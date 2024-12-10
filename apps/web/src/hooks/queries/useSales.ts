import { getAllSales } from "@/server/queries/sales";
import type { useQueryOptions } from "@/types/types";
import type { Period } from "@/util/static";
import { useQuery } from "@tanstack/react-query";

type salesOptions = useQueryOptions & {
  period: (typeof Period)[number];
  bankAccountId?: string;
  page: number;
  limit: number;
  isCancelled: boolean;
  customerId?: string;
};

export function useSales({
  period,
  bankAccountId,
  page = 1,
  limit = 10,
  isCancelled,
  customerId,
}: salesOptions) {
  const { isLoading, error, data, refetch, isRefetching } = useQuery({
    queryKey: [
      "getAllSales",
      period,
      bankAccountId,
      page,
      limit,
      isCancelled,
      customerId,
    ],
    queryFn: () =>
      getAllSales({
        period,
        bankAccountId,
        page,
        limit,
        isCancelled,
        customerId,
      }),
  });

  return { isLoading, error, data, refetch, isRefetching };
}
