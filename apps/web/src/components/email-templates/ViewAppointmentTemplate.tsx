import AppointmentFriendlyDatetimeLabel from "@/app/(private)/appointments/_components/appointment-friendly-datetime-label";
import ContactInfo from "@/app/(private)/configuration/_components/contact-info";
import SocialLinks from "@/app/(private)/configuration/_components/social-links";
import type { ExtendedAppointment } from "@/types/entities/appointment";
import { datesDistance } from "@/util/formatters";
import { formatPrice } from "@/util/utils";
import type { Company } from "@repo/database";

export const ViewAppointmentTemplate = ({
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
    <h1>Hola, {appointment.customer.name} &#128075;!</h1>
    <h2>
      Tu turno es{" "}
      {datesDistance(new Date(appointment.fromDatetime), new Date())}
    </h2>
    <div>{company.name} te ha enviado los datos de tu turno:</div>
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
    <div>
      Si los datos son incorrectos, por favor, contactate con {company.name}
    </div>
    <ContactInfo company={company} />
    <SocialLinks company={company} />
  </div>
);
