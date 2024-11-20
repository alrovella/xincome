"use client";
import SecondaryLink from "@/components/common/links/secondary-link";
import type { Schedule } from "@repo/database";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@repo/ui/components/ui/alert-dialog";
import { Button } from "@repo/ui/components/ui/button";
import { TableCell, TableRow } from "@repo/ui/components/ui/table";
import { CheckCircle, PencilLine, Ban, X } from "lucide-react";

const ScheduleTableRow = ({
  schedule,
  onDeleteSchedule,
  deletingSchedule,
  deletingDisabled,
}: {
  schedule: Schedule;
  onDeleteSchedule: (scheduleId: string) => void;
  deletingSchedule: boolean;
  deletingDisabled?: boolean;
}) => {
  return (
    <TableRow className="hover:bg-background">
      <TableCell>{schedule.name}</TableCell>
      <TableCell>
        {schedule.active ? (
          <span className="flex items-center gap-1 text-green-500">
            <CheckCircle className="size-4" /> Activa
          </span>
        ) : (
          <span className="flex items-center gap-1 text-red-500">
            <Ban className="size-4" /> Inactiva
          </span>
        )}
      </TableCell>
      <TableCell className="flex justify-end gap-1">
        <SecondaryLink href={`/schedules/edit/${schedule.id}`}>
          <PencilLine className="size-4" />
        </SecondaryLink>

        <AlertDialog>
          <AlertDialogTrigger
            disabled={deletingSchedule || deletingDisabled}
            asChild
          >
            <Button
              variant="destructiveOutline"
              size="xs"
              disabled={deletingSchedule || deletingDisabled}
            >
              <X className="size-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-destructive text-xl">
                ATENCION
              </AlertDialogTitle>
              <AlertDialogDescription className="flex flex-col gap-6">
                <div>
                  Una vez eliminada, no podrás recuperar esta agenda ni los
                  turnos relacionados.
                </div>
                <strong className="text-destructive text-lg">
                  Estás seguro de eliminar esta agenda?
                </strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cerrar</AlertDialogCancel>
              <AlertDialogAction
                disabled={deletingSchedule}
                onClick={() => onDeleteSchedule(schedule.id)}
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
};

export default ScheduleTableRow;
