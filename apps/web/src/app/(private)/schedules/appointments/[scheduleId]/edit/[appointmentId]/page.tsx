import { getAppointmentById } from "@/server/queries/appointments";
import NotFound from "../not-found";
import { getScheduleById } from "@/server/queries/schedules";
import AppointmentForm from "@/app/(private)/appointments/_components/appointment-form";

export default async function EditAppointmentPage({
  params,
}: {
  params: Promise<{ appointmentId: string; scheduleId: string }>;
}) {
  const { appointmentId, scheduleId } = await params;

  const [schedule, appointment] = await Promise.all([
    getScheduleById(scheduleId),
    getAppointmentById(appointmentId),
  ]);

  if (appointment === null || schedule === null) return NotFound();

  return <AppointmentForm appointment={appointment} scheduleId={schedule.id} />;
}
