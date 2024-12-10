import { getAllPurchases } from "@/server/queries/purchases";
import type { useQueryOptions } from "@/types/types";
import type { Period } from "@/util/static";
import { useQuery } from "@tanstack/react-query";

type purchasesOptions = useQueryOptions & {
  period: (typeof Period)[number];
  page: number;
  limit: number;
  bankAccountId?: number;
  supplierId?: string;
};

export function usePurchases({
  page = 1,
  limit = 10,
  period,
  bankAccountId,
  supplierId,
}: purchasesOptions) {
  const { isLoading, error, data, isRefetching } = useQuery({
    queryKey: [
      "getAllPurchases",
      period,
      page,
      limit,
      bankAccountId,
      supplierId,
    ],
    queryFn: () =>
      getAllPurchases({ period, page, limit, bankAccountId, supplierId }),
  });

  return { isLoading, error, data, isRefetching };
}
