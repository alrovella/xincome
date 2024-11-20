import { useQuery } from "@tanstack/react-query";
import { getAppointmentsIncomeByDates } from "@/server/queries/appointments";
import {
  getCurrentMonthCustomersBirthdates,
  getMostLoyalCustomers as getFrequentCustomers,
} from "@/server/queries/customers";
import type { Customer } from "@repo/database";
import type { useQueryOptions } from "@/types/types";
import type { RequentCustomer } from "@/types/entities/customers";

type useAppointmentsIncomeByDates = useQueryOptions & {
  fromDate: Date;
  toDate: Date;
};

export function useAppointmentsIncomeByDates({
  fromDate,
  toDate,
  enabled,
  staleTime,
}: useAppointmentsIncomeByDates) {
  const { data, refetch, isLoading, isError } = useQuery<number>({
    queryKey: ["getAppointmentsIncomeByDates", fromDate, toDate],
    queryFn: () => getAppointmentsIncomeByDates(fromDate, toDate),
    staleTime: staleTime,
    enabled,
  });
  return { data, refetch, isLoading, isError };
}

export function useFrequentCustomers({ staleTime }: useQueryOptions) {
  const { data, refetch, isLoading, isError } = useQuery<RequentCustomer[]>({
    queryKey: ["getFrequentCustomers"],
    queryFn: () => getFrequentCustomers(),
    staleTime: staleTime,
  });

  return { data, refetch, isLoading, isError };
}

export function useCustomerBirthdates() {
  const { data, refetch, isLoading, isError } = useQuery<Customer[]>({
    queryKey: ["getCurrentMonthCustomersBirthdates"],
    queryFn: () => getCurrentMonthCustomersBirthdates(),
  });

  return { data, refetch, isLoading, isError };
}
