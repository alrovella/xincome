"use client";
import { CalendarPlus } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@repo/ui/components/ui/dropdown-menu";
import { useSchedules } from "@/hooks/queries/useSchedule";
import NavLink from "@/components/common/layout/NavLink";

const NewAppointmentButton = ({ className }: { className?: string }) => {
  const { data: schedules } = useSchedules();
  if (schedules && schedules?.length > 0)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className={className} asChild>
          <Button variant="shine" size="xs" className="flex items-center gap-1">
            <CalendarPlus className="size-4" />
            <span>Nuevo Turno</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Nuevo turno para Agenda:</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {schedules?.map((schedule) => (
              <DropdownMenuItem key={schedule.id}>
                <NavLink
                  className="flex items-center gap-1 w-full"
                  href={`schedules/appointments/${schedule.id}/new`}
                >
                  {schedule.name}
                </NavLink>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
};
export default NewAppointmentButton;
