import { Button } from "@repo/ui/components/ui/button";
import { BookAIcon, Calendar, ChevronDown, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@repo/ui/components/ui/card";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@repo/ui/components/ui/dropdown-menu";
import { format, isPast } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/components/ui/alert-dialog";
import Link from "next/link";
import type { ExtendedAppointment } from "@/types/entities/appointment";
import { datesDistance } from "@/util/formatters";
import StatusBadge from "./status-badge";
import ChargeStatusBadge from "./charge-status-badge";
import CustomerAppointmentsDrawer from "../../customers/_components/customer-appointments-drawer";
import CustomerInfoDrawer from "../../customers/_components/customer-info-drawer";
import AddToGoogleCalendarButton from "./add-to-google-calendar-button";
import SendWhatsappDropdownMenu from "./send-whatsapp-dropdown-menu";

type AppointmentCardProps = {
  appointment: ExtendedAppointment;
  onConfirm?: (appointmentId: string) => void;
  onCancel?: (appointmentId: string) => void;
  isConfirming?: boolean;
  isCancelling?: boolean;
  showOptions?: {
    editAppointment?: boolean;
    appointmentPayments?: boolean;
    cancelAppointment?: boolean;
    confirmAppointment?: boolean;
    addToGoogleCalendar?: boolean;
    sendWhatsapp?: boolean;
    customerInfo?: boolean;
    lastsCustomerAppointments?: boolean;
  };
};

export const AppointmentCard = ({
  appointment,
  onConfirm,
  onCancel,
  isConfirming,
  isCancelling,
  showOptions,
}: AppointmentCardProps) => {
  return (
    <Card className="card">
      <CardHeader className="px-3 py-1 select-none card-header">
        <div className="grid grid-cols-2">
          <div>
            <h2 className="font-bold text-3xl text-primary">
              {format(new Date(appointment.fromDatetime), "dd")}
            </h2>
            <div className="font-medium text-muted-foreground text-sm">
              {format(appointment.fromDatetime, "MMMM yyyy", {
                locale: es,
              }).toUpperCase()}
            </div>
            <div className="text-xs">
              {datesDistance(new Date(appointment.fromDatetime), new Date())}
            </div>
          </div>
          <div className="flex justify-end items-start pt-2">
            <StatusBadge status={appointment.status} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="gap-3 grid">
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 w-4 h-4 text-primary" />
            <span>
              {format(appointment.fromDatetime, "EEEE HH:mm", {
                locale: es,
              })}{" "}
              hs.
            </span>
          </div>
          <div className="flex items-center text-sm">
            <User className="mr-2 w-4 h-4 text-primary" />
            <span className="font-medium">{appointment.customer.name}</span>
          </div>
          <div className="flex items-center text-sm">
            <BookAIcon className="mr-2 w-4 h-4 text-primary" />
            <span className="text-pretty">
              {appointment.schedule.name}, {appointment.service.name} (
              {appointment.service.durationInMinutes} min)
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center card-footer">
        <ChargeStatusBadge chargeStatus={appointment.chargeStatus} />
        {showOptions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-between"
              >
                Opciones <ChevronDown className="size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Opciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {showOptions?.editAppointment && (
                  <DropdownMenuItem>
                    <Link
                      className="w-full"
                      href={`/schedules/appointments/${appointment.scheduleId}/edit/${appointment.id}`}
                    >
                      Editar turno
                    </Link>
                  </DropdownMenuItem>
                )}
                {showOptions?.appointmentPayments && (
                  <DropdownMenuItem>
                    <Link
                      className="w-full"
                      href={`/schedules/appointments/${appointment.scheduleId}/payments/${appointment.id}`}
                    >
                      Cobranzas del turno
                    </Link>
                  </DropdownMenuItem>
                )}
                {showOptions?.lastsCustomerAppointments && (
                  <DropdownMenuItem>
                    <CustomerAppointmentsDrawer
                      customerId={appointment.customer.id}
                      customerName={appointment.customer.name}
                      buttonText="Ultimos turnos del cliente"
                    />
                  </DropdownMenuItem>
                )}
                {showOptions?.customerInfo && (
                  <DropdownMenuItem>
                    <CustomerInfoDrawer customer={appointment.customer} />
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
              {showOptions?.addToGoogleCalendar && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <AddToGoogleCalendarButton appointment={appointment} />
                  </DropdownMenuItem>
                </>
              )}
              {showOptions?.sendWhatsapp && (
                <>
                  <DropdownMenuSeparator />
                  <SendWhatsappDropdownMenu
                    customer={appointment.customer}
                    appointment={appointment}
                  />
                </>
              )}

              {showOptions?.confirmAppointment &&
              appointment &&
              onConfirm &&
              appointment.status === "NO_CONFIRMADO" ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled={isConfirming}>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Link href="" className="w-full">
                          Confirmar turno
                        </Link>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Turno</AlertDialogTitle>
                          <AlertDialogDescription className="flex flex-col gap-2 py-4">
                            <div className="font-semibold">
                              Seguro de confirmar este turno?
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>No, gracias</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onConfirm(appointment.id)}
                            disabled={isConfirming}
                          >
                            Confirmar turno
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuItem>
                </>
              ) : null}

              {showOptions?.cancelAppointment &&
              appointment &&
              onCancel &&
              appointment.status !== "CANCELADO" ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    disabled={
                      isCancelling ||
                      isPast(appointment?.fromDatetime ?? new Date())
                    }
                  >
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Link href="" className="w-full text-destructive">
                          Cancelar turno
                        </Link>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancelar Turno</AlertDialogTitle>
                          <AlertDialogDescription className="flex flex-col gap-2 py-4">
                            <div className="font-semibold">
                              Seguro de cancelar este turno?
                            </div>
                            <div>
                              Esta acción no se puede deshacer, por lo tanto
                              chequea la información y confirma.
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              onCancel(appointment.id);
                            }}
                            disabled={isCancelling}
                          >
                            Confirmar Cancelación
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardFooter>
    </Card>
  );
};
