import AppointmentFriendlyDatetimeLabel from "@/app/(private)/appointments/_components/appointment-friendly-datetime-label";
import ContactInfo from "@/app/(private)/configuration/_components/contact-info";
import SocialLinks from "@/app/(private)/configuration/_components/social-links";
import type { ExtendedAppointment } from "@/types/entities/appointment";
import { formatPrice } from "@/util/utils";
import type { Company } from "@repo/database";

export const CreateAppointmentTemplate = ({
  company,
  appointment,
}: {
  company: Company;
  appointment: ExtendedAppointment;
}) => (
  <div
    style={{
      fontSize: "16px",
    }}
  >
    <h1>
      Gracias por solicitar un turno con nosotros, {appointment.customer.name}!
    </h1>

    <div>Se ha creado un nuevo turno para ti.</div>

    <div>Los datos del turno son:</div>
    <ul>
      <li>Servicio: {appointment.service.name}</li>
      <li>
        Fecha y Hora:{" "}
        <AppointmentFriendlyDatetimeLabel datetime={appointment.fromDatetime} />
      </li>
      <li>Total a pagar: {formatPrice(appointment.totalToPay)}</li>
      {appointment.publicNotes && (
        <li>Comentarios: {appointment.publicNotes}</li>
      )}
    </ul>

    <div>Si los datos son correctos, por favor, confirma el turno</div>

    <a
      href={`${process.env.NEXT_PUBLIC_BASE_URL}/web/${company.slug}/appointment/${appointment.id}`}
      style={{ fontSize: "20px", fontWeight: "bold", textDecoration: "none" }}
    >
      Confirmar Turno!
    </a>

    <ContactInfo company={company} />
    <SocialLinks company={company} />
  </div>
);
