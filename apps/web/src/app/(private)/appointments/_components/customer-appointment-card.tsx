"use client";

import { Button } from "@repo/ui/components/ui/button";
import {
  confirmAppointment,
  customerCancelAppointment,
} from "@/server/actions/appointments";
import { useState } from "react";
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
import AppointmentFriendlyDatetimeLabel from "./appointment-friendly-datetime-label";
import type { ExtendedAppointment } from "@/types/entities/appointment";
import { formatPrice } from "@/util/utils";
import { useAppUser } from "@/providers/UserContextProvider";

const CustomerAppointmentCard = ({
  initialAppointment,
}: {
  initialAppointment: ExtendedAppointment;
}) => {
  const { company } = useAppUser();
  const [appointment, setAppointment] = useState(initialAppointment);
  const [confirming, setConfirming] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [appointmentProcessed, setAppointmentProcessed] = useState(false);

  const handleConfirmAppointmentClick = () => {
    setConfirming(true);
    confirmAppointment(appointment.id).then(() => {
      if (appointment) setAppointment({ ...appointment, status: "CONFIRMADO" });
      setAppointmentProcessed(true);
    });
  };

  const handleCancelAppointmentClick = () => {
    setCanceling(true);
    customerCancelAppointment(appointment.id).then(() => {
      if (appointment) setAppointment({ ...appointment, status: "CANCELADO" });
      setAppointmentProcessed(true);
    });
  };

  return (
    <div className="my-6">
      <div className="flex flex-col gap-2 py-4 min-w-[400px] min-h-[300px]">
        {appointmentProcessed ? (
          <div className="flex flex-col items-center gap-2 p-32">
            <h4 className="font-bold text-lg">
              Tu servicio ha sido {appointment.status.toLocaleLowerCase()}
            </h4>
            <div>Gracias por utilizar nuestros servicios!</div>
          </div>
        ) : (
          <>
            {appointment.status === "NO_CONFIRMADO" ||
            appointment.status === "CONFIRMADO" ? (
              <>
                <h1 className="font-bold">Hola {appointment.customer.name}.</h1>
                <h2 className="mb-4 font-semibold">
                  {appointment.status === "NO_CONFIRMADO" && (
                    <span className="text-info">
                      Se ha creado un turno para vos y está pendiente de tu
                      confirmación
                    </span>
                  )}

                  {appointment.status === "CONFIRMADO" && (
                    <span className="text-info">
                      Ya confirmaste tu turno con anterioridad.
                    </span>
                  )}
                </h2>
                <h3 className="font-semibold">DATOS DEL TURNO</h3>
                <ul className="mb-2">
                  <li>Servicio: {appointment.service.name}</li>
                  <li>
                    Fecha y Hora:{" "}
                    <AppointmentFriendlyDatetimeLabel
                      datetime={appointment.fromDatetime}
                    />
                  </li>
                  <li>Total a pagar: {formatPrice(appointment.totalToPay)}</li>
                </ul>
              </>
            ) : (
              <>
                <h1 className="font-bold">Hola {appointment.customer.name}.</h1>
                <h2 className="mb-4 font-semibold text-destructive">
                  Tu turno ha sido cancelado
                </h2>
              </>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col justify-center gap-2">
        {appointment.status === "NO_CONFIRMADO" ||
        (appointment.status === "CONFIRMADO" && !appointmentProcessed) ? (
          <div className="flex justify-center items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger disabled={canceling} asChild>
                <Button variant="destructive" disabled={canceling}>
                  Cancelar turno
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Estás seguro de cancelar el turno?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Para obtener otro turno deberás contactarte con{" "}
                    {company.name}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cerrar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancelAppointmentClick}>
                    Cancelar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {appointment.status === "NO_CONFIRMADO" && (
              <AlertDialog>
                <AlertDialogTrigger disabled={confirming} asChild>
                  <Button variant="shine" disabled={confirming}>
                    Confirmar turno
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Estás seguro de confirmar el turno?
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cerrar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmAppointmentClick}>
                      Confirmar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CustomerAppointmentCard;
