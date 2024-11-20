"use client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { useState } from "react";
import { User } from "lucide-react";
import Link from "next/link";
import { useSchedules } from "@/hooks/queries/useSchedule";
import ScheduleTableRow from "./schedule-table-row";
import { deleteSchedule } from "@/server/actions/schedules";
import ListSkeleton from "@/components/common/skeletons/list-skeleton";
import EmptyStateAlert from "@/components/common/empty-state-alert";

const ScheduleTable = () => {
  const [deletingSchedule, setDeletingSchedule] = useState(false);

  const {
    data: dataSchedules,
    isLoading: loadingSchedcules,
    refetch: refetchSchedules,
  } = useSchedules();

  const handleDeleteSchedule = async (scheduleId: string) => {
    setDeletingSchedule(true);
    await deleteSchedule(scheduleId);
    setDeletingSchedule(false);
    refetchSchedules();
  };

  return (
    <>
      {loadingSchedcules ? (
        <ListSkeleton />
      ) : (
        <>
          {dataSchedules?.length === 0 ? (
            <EmptyStateAlert>
              <User className="size-16" />
              <h2 className="font-bold text-xl">
                Todavía no tenés agendas creadas
              </h2>
              <Link href="/schedules/new">Creá una haciendo click aquí</Link>
            </EmptyStateAlert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agenda</TableHead>
                  <TableHead> </TableHead>
                  <TableHead> </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataSchedules?.map((schedule) => (
                  <ScheduleTableRow
                    key={schedule.id}
                    schedule={schedule}
                    onDeleteSchedule={handleDeleteSchedule}
                    deletingSchedule={deletingSchedule}
                    deletingDisabled={dataSchedules?.length === 1}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}
    </>
  );
};

export default ScheduleTable;
