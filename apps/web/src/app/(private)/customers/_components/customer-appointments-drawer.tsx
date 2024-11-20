"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@repo/ui/components/ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@repo/ui/components/ui/table";
import Link from "next/link";
import { cn } from "@repo/ui/lib/utils";
import type { ExtendedAppointment } from "@/types/entities/appointment";
import { getLastConfirmedAppointmentsByCustomerById } from "@/server/queries/appointments";
import ListSkeleton from "@/components/common/skeletons/list-skeleton";
import AppointmentFriendlyDatetimeLabel from "../../appointments/_components/appointment-friendly-datetime-label";
import ChargeStatusBadge from "../../appointments/_components/charge-status-badge";
import StatusBadge from "../../appointments/_components/status-badge";

const CustomerAppointmentsDrawer = ({
  customerId,
  customerName,
  buttonText,
  buttonClassName,
}: {
  customerId: string;
  customerName: string;
  buttonText?: string;
  buttonClassName?: string;
}) => {
  const [appointments, setAppointments] = useState<ExtendedAppointment[]>([]);
  const [open, setOpen] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  const getAppointments = async () => {
    setLoadingAppointments(true);
    setOpen(true);
    const data = await getLastConfirmedAppointmentsByCustomerById(customerId);
    setLoadingAppointments(false);
    setAppointments(data);
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            className={cn(buttonClassName)}
            href=""
            onClick={getAppointments}
          >
            {buttonText}
          </Link>
        </TooltipTrigger>
        {!buttonText && <TooltipContent>Ver Ultimos Turnos</TooltipContent>}
      </Tooltip>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-2xl">
            <DrawerHeader>
              <DrawerTitle className="text-center">
                Ultimos Turnos de {customerName}
              </DrawerTitle>
            </DrawerHeader>
            <div className="min-h-[300px]">
              {appointments.length === 0 && !loadingAppointments && (
                <div className="text-center text-destructive">
                  El cliente no tiene turnos
                </div>
              )}
              {loadingAppointments ? (
                <div className="text-center">
                  <ListSkeleton />
                </div>
              ) : (
                <Table className="w-full">
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <AppointmentFriendlyDatetimeLabel
                            datetime={appointment.fromDatetime}
                          />
                        </TableCell>
                        <TableCell>{appointment.service.name}</TableCell>
                        <TableCell className="flex justify-end items-center gap-1">
                          <StatusBadge status={appointment.status} />
                          <ChargeStatusBadge
                            chargeStatus={appointment.chargeStatus}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cerrar</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CustomerAppointmentsDrawer;
