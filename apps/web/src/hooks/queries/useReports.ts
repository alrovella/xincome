import { getStockReport } from "@/server/queries/stock";
import {
  appointmentPaymentsReport,
  appointmentsGroupByServiceReport,
  appointmentsTimelineReport,
  bankAccountTransactionsReport,
} from "@/server/queries/reports";
import type {
  AppointmentLongPeriodFilter,
  AppointmentPeriodFilter,
} from "@/types/entities/appointment";
import type {
  AppointmentPaymentsReport,
  AppointmentsByServiceReport,
  AppointmentTimelineReport,
} from "@/types/entities/reports";
import { useQuery } from "@tanstack/react-query";

export function useBankAccountTransactionsReport({
  fromDate,
  toDate,
}: {
  fromDate: Date;
  toDate: Date;
}) {
  const { isLoading, error, data } = useQuery({
    queryKey: ["bankAccountTransactionsReport", fromDate, toDate],
    queryFn: () => bankAccountTransactionsReport({ fromDate, toDate }),
    staleTime: 0,
    gcTime: 0,
  });
  return { isLoading, error, data };
}

export function useStockReport() {
  const { isLoading, error, data, isRefetching } = useQuery({
    queryKey: ["getStockReport"],
    queryFn: () => getStockReport(),
    staleTime: 0,
    gcTime: 0,
  });
  return { isLoading, error, data, isRefetching };
}

export function useAppointmentsGroupByServiceReport({
  period,
}: {
  period: (typeof AppointmentPeriodFilter)[number];
}) {
  const { data, refetch, isLoading } = useQuery<AppointmentsByServiceReport>({
    queryKey: ["appointmentsGroupByServiceReport", period],
    queryFn: async () => {
      return appointmentsGroupByServiceReport({
        period,
      });
    },
    enabled: !!period,
  });

  return { data, isLoading, refetch };
}

export function useAppointmentsTimelineReport({
  period,
}: {
  period: (typeof AppointmentLongPeriodFilter)[number];
}) {
  const { data, refetch, isLoading } = useQuery<AppointmentTimelineReport>({
    queryKey: ["appointmentsTimelineReport", period],
    queryFn: async () => {
      return appointmentsTimelineReport({
        period,
      });
    },
    enabled: !!period,
  });

  return { data, isLoading, refetch };
}

export function useAppointmentPaymentsReport({
  period,
}: {
  period: (typeof AppointmentLongPeriodFilter)[number];
}) {
  const { data, refetch, isLoading } = useQuery<AppointmentPaymentsReport>({
    queryKey: ["appointmentPaymentsReport", period],
    queryFn: async () => {
      return appointmentPaymentsReport({
        period,
      });
    },
    enabled: !!period,
  });

  return { data, isLoading, refetch };
}
