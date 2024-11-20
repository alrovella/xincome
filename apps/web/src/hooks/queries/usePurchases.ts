import { getAllPurchases } from "@/server/queries/purchases";
import type { useQueryOptions } from "@/types/types";
import type { Period } from "@/util/static";
import { useQuery } from "@tanstack/react-query";

type purchasesOptions = useQueryOptions & {
  period: (typeof Period)[number];
  page: number;
  limit: number;
  bankAccountId?: number;
};

export function usePurchases({
  page = 1,
  limit = 10,
  period,
  bankAccountId,
}: purchasesOptions) {
  const { isLoading, error, data, isRefetching } = useQuery({
    queryKey: ["getAllPurchases", period, page, limit, bankAccountId],
    queryFn: () => getAllPurchases({ period, page, limit, bankAccountId }),
  });

  return { isLoading, error, data, isRefetching };
}
