import {
  getAllBankAccounts,
  getBankAccount,
} from "@/server/queries/bank-accounts";
import type { useQueryOptions } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export function useBankAccounts() {
  const { error, data, refetch, fetchStatus } = useQuery({
    queryKey: ["getAllBankAccounts"],
    queryFn: () => getAllBankAccounts(),
    staleTime: 1800,
    gcTime: 1800,
  });

  return { error, data, refetch, fetchStatus };
}

type bankAccountsOptions = useQueryOptions & {
  id: number;
};

export function useBankAccount({ id }: bankAccountsOptions) {
  const { isLoading, error, data } = useQuery({
    queryKey: ["getBankAccount", id],
    queryFn: () => getBankAccount(id),
  });

  return { isLoading, error, data };
}
