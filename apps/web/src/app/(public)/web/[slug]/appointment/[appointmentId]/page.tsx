import { getAppointmentById } from "@/server/queries/appointments";
import NotFound from "./not-found";
import CustomerAppointmentCard from "@/app/(private)/appointments/_components/customer-appointment-card";

export default async function ConfirmAppointmentPage({
  params,
}: {
  params: Promise<{ appointmentId: string }>;
}) {
  const { appointmentId } = await params;

  const appointment = await getAppointmentById(appointmentId);
  if (!appointment) return NotFound();

  return <CustomerAppointmentCard initialAppointment={appointment} />;
}
