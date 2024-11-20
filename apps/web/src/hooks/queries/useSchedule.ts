import { useQuery } from "@tanstack/react-query";
import type { Schedule } from "@repo/database";
import { getScheduleById, getSchedules } from "@/server/queries/schedules";
import type { ScheduleExtended } from "@/types/entities/schedule";

export function useSchedules() {
  const { data, refetch, isLoading, isError } = useQuery<Schedule[]>({
    queryKey: ["getSchedules"],
    queryFn: () => getSchedules(),
  });

  return { data, refetch, isLoading, isError };
}

export function useSchedule({ scheduleId }: { scheduleId?: string | null }) {
  const { data, refetch, isLoading, isError } =
    useQuery<ScheduleExtended | null>({
      queryKey: ["getScheduleById", scheduleId],
      queryFn: () => getScheduleById(scheduleId),
    });

  return { data, refetch, isLoading, isError };
}
