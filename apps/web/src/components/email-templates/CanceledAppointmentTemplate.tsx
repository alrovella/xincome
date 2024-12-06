import AppointmentFriendlyDatetimeLabel from "@/app/(private)/appointments/_components/appointment-friendly-datetime-label";
import type { ExtendedAppointment } from "@/types/entities/appointment";
import { formatPrice } from "@/util/utils";

export const CanceledAppointmentTemplate = ({
  appointment,
}: {
  appointment: ExtendedAppointment;
}) => (
  <div
    style={{
      fontSize: "16px",
    }}
  >
    <h1 style={{ color: "red" }}>Turno Cancelado</h1>
    <div>Los datos del turno son:</div>
    <ul>
      <li>Cliente: {appointment.customer.name}</li>
      <li>Servicio: {appointment.service.name}</li>
      <li>
        Fecha y Hora:{" "}
        <AppointmentFriendlyDatetimeLabel datetime={appointment.fromDatetime} />
      </li>
      <li>Duración: {appointment.service.durationInMinutes} minutos</li>
      <li>Total a cobrar: ${formatPrice(appointment.totalToPay)}</li>
      {appointment.publicNotes && (
        <li>Comentarios: {appointment.publicNotes}</li>
      )}
    </ul>
    <a
      href={`${process.env.NEXT_PUBLIC_BASE_URL}/schedules/appointments${appointment.scheduleId}/edit/${appointment.id}`}
      style={{ fontSize: "20px", fontWeight: "bold", textDecoration: "none" }}
    >
      Editar turno
    </a>
  </div>
);
