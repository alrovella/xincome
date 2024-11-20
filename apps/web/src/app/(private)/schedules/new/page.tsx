import { getDefaultBusinessHours } from "@/server/queries/schedules";
import NotFound from "@/app/not-found";
import { getLoggedInUser } from "@/server/queries/users";
import EmptyStateAlert from "@/components/common/empty-state-alert";
import UpgradePlanLink from "@/components/common/upgrade-plan-link";
import ScheduleForm from "../_components/schedule-form";
import { Container } from "@repo/ui/components/ui/container";

export default async function NewSchedulePage() {
  const [user, businessHours] = await Promise.all([
    getLoggedInUser(),
    getDefaultBusinessHours(),
  ]);
  if (!user) return NotFound();

  const noSchedulesLeft =
    user.company.schedules.length === user.company.companyPlan?.maxSchedules;

  if (noSchedulesLeft)
    return (
      <EmptyStateAlert>
        <h2 className="font-bold text-xl">No hay agendas disponibles</h2>
        <h3 className="font-semibold text-lg">
          Has alcanzado el limite de agendas
        </h3>
        <div>Para acceder a mas agendas podés actualizar tu plan.</div>
        <UpgradePlanLink />
      </EmptyStateAlert>
    );

  return (
    <Container title="Nueva Agenda">
      <ScheduleForm
        companyServices={user.company.services}
        defaultBusinessHours={businessHours}
      />
    </Container>
  );
}
