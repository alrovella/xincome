import { useQuery } from "@tanstack/react-query";
import type { CompanyCategory } from "@repo/database";
import { getCompanyCategories } from "@/server/queries/company-categories";

export function useGetCategories() {
  const { data, refetch, isLoading, isError } = useQuery<CompanyCategory[]>({
    queryKey: ["getbCompanyCategories"],
    queryFn: () => getCompanyCategories(),
    staleTime: 1800,
    gcTime: 1800,
  });

  return { data, refetch, isLoading, isError };
}
