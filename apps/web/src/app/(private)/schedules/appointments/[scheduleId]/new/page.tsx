import AppointmentForm from "@/app/(private)/appointments/_components/appointment-form";
import { getScheduleById } from "@/server/queries/schedules";

export default async function NewAppointmentPage({
  params,
}: {
  params: Promise<{ scheduleId: string }>;
}) {
  const { scheduleId } = await params;

  const [schedule] = await Promise.all([getScheduleById(scheduleId)]);
  if (!schedule) return <></>;
  return <AppointmentForm scheduleId={schedule.id} />;
}
