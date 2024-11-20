import { useQuery } from "@tanstack/react-query";
import { getServices, getServicesBySchedule } from "@/server/queries/services";
import type { Service } from "@repo/database";

export function useGetServices() {
  const { data, refetch, isLoading, isError } = useQuery<Service[]>({
    queryKey: ["getServices"],
    queryFn: () => getServices(),
    staleTime: 1800,
    gcTime: 1800,
  });

  return { data, refetch, isLoading, isError };
}

export function useGetServicesBySchedule({
  scheduleId,
}: {
  scheduleId: string;
}) {
  const { data, refetch, isLoading, isError } = useQuery<Service[]>({
    queryKey: ["getServicesBySchedule"],
    queryFn: () => getServicesBySchedule(scheduleId),
    staleTime: 0,
    gcTime: 0,
    enabled: !!scheduleId,
  });

  return { data, refetch, isLoading, isError };
}
