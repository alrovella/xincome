import { getScheduleById } from "@/server/queries/schedules";
import NotFound from "@/app/not-found";
import { getLoggedInUser } from "@/server/queries/users";
import ScheduleForm from "../../_components/schedule-form";
import { Container } from "@repo/ui/components/ui/container";

export default async function EditCustometPage({
  params,
}: {
  params: Promise<{ scheduleId: string }>;
}) {
  const { scheduleId } = await params;

  const [user, schedule] = await Promise.all([
    getLoggedInUser(),
    getScheduleById(scheduleId),
  ]);

  if (!user || !schedule) return NotFound();

  return (
    <Container title="Editar Agenda">
      <ScheduleForm
        companyServices={user?.company.services}
        schedule={schedule}
        defaultBusinessHours={[]}
      />
    </Container>
  );
}
