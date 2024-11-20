import type { ExtendedAppointment } from "@/types/entities/appointment";
import { convertToGoogleCalendarDate } from "@/util/utils";
import Link from "next/link";

const AddToGoogleCalendarButton = ({
  appointment,
}: {
  appointment: ExtendedAppointment;
}) => {
  const addToGooggleCalendarLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${appointment.customer.name} - ${appointment.service.name}&details=${appointment.privateNotes}&dates=${convertToGoogleCalendarDate(appointment.fromDatetime)}/${convertToGoogleCalendarDate(appointment.toDatetime)}`;

  return (
    <Link target="_blank" className="w-full" href={addToGooggleCalendarLink}>
      Agregar a Google Calendar
    </Link>
  );
};

export default AddToGoogleCalendarButton;
