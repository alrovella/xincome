import { useQuery } from "@tanstack/react-query";
import type { CompanyCategory } from "@repo/database";
import { getCompanyCategory } from "@/server/queries/company-categories";

export function useCompanyCategory() {
  const { data, refetch, isLoading, isError } =
    useQuery<CompanyCategory | null>({
      queryKey: ["getCompanyCategory"],
      queryFn: () => getCompanyCategory(),
      staleTime: 1800,
      gcTime: 1800,
    });

  return { data, refetch, isLoading, isError };
}
