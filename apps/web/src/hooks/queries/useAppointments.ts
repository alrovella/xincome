import { useQuery } from "@tanstack/react-query";
import {
  getAppointmentById,
  getAppointments,
} from "@/server/queries/appointments";
import { useAppointmentsFilterStore } from "../stores/useAppointmentsFilterStore";
import type { ExtendedAppointment } from "@/types/entities/appointment";
import type { useQueryOptions } from "@/types/types";

export function useAppointments() {
  const { status, period, customerName, chargeStatus, scheduleId } =
    useAppointmentsFilterStore();

  const { data, refetch, isLoading, isRefetching } = useQuery<
    ExtendedAppointment[]
  >({
    queryKey: [
      "getAppointments",
      status,
      period,
      customerName,
      chargeStatus,
      scheduleId,
    ],
    queryFn: async () => {
      return getAppointments({
        status,
        period,
        customerName,
        chargeStatus,
        scheduleId,
      });
    },
    refetchOnWindowFocus: true,
    enabled:
      !status || !customerName || !chargeStatus || !scheduleId || !period,
  });

  return { data, isLoading, refetch, isRefetching };
}

type useAppointmentOptions = useQueryOptions & {
  appointmentId: string;
};

export function useAppointment({ appointmentId }: useAppointmentOptions) {
  const { data, refetch, isLoading, isError } =
    useQuery<ExtendedAppointment | null>({
      queryKey: ["getAppointment", appointmentId],
      queryFn: async () => {
        return getAppointmentById(appointmentId);
      },
    });

  return { data, refetch, isLoading, isError };
}
