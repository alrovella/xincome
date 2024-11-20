import { getAllPayments, getPayment } from "@/server/queries/payments";
import type { useQueryOptions } from "@/types/types";
import type { Period } from "@/util/static";
import type { PaymentType } from "@repo/database";
import { useQuery } from "@tanstack/react-query";

type paymentsOptions = useQueryOptions & {
  period?: (typeof Period)[number];
  bankAccountId?: string;
  appointmentId?: string;
  page: number;
  limit: number;
  isCancelled: boolean;
  paymentType: PaymentType;
};

export function usePayments({
  period,
  bankAccountId,
  page,
  limit,
  isCancelled,
  paymentType,
  appointmentId,
}: paymentsOptions) {
  const { isLoading, error, data, refetch, isRefetching } = useQuery({
    queryKey: [
      "getAllPayments",
      period,
      bankAccountId,
      page,
      limit,
      isCancelled,
      paymentType,
      appointmentId,
    ],
    queryFn: () =>
      getAllPayments({
        period,
        bankAccountId,
        page,
        limit,
        isCancelled,
        paymentType,
        appointmentId,
      }),
  });

  return { isLoading, error, data, refetch, isRefetching };
}

type paymentOption = useQueryOptions & {
  id: string;
};

export function usePayment({ id }: paymentOption) {
  const { isLoading, error, data } = useQuery({
    queryKey: ["getPayment", id],
    queryFn: () => getPayment(id),
  });

  return { isLoading, error, data };
}
