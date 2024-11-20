import { getPlans } from "@/server/queries/plans";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { cn } from "@repo/ui/lib/utils";
import {
  Book,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  Globe,
} from "lucide-react";
import PlanForm from "./plan-form";
import { getLoggedInUser } from "@/server/queries/users";

const Plans = async () => {
  const plans = await getPlans();
  const user = await getLoggedInUser();
  if (!user || !plans) return null;

  return (
    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {plans.map((plan) => (
        <Card
          className={cn(
            "flex flex-col h-full border border-accent shadow-md card",
            user.company.companyPlanId === plan.id &&
              "shadow-xl border-2 border-primary/70",
            plan.bestSeller && "shadow-lg border-0"
          )}
          key={plan.id}
        >
          <CardHeader className="card-header">
            <CardTitle
              className={cn(
                "flex items-center justify-between",
                plan.bestSeller && "text-primary"
              )}
            >
              <span>{plan.name}</span>
              {user.company.companyPlanId === plan.id && (
                <small className="font-normal text-sm">(tu plan actual)</small>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="py-4 min-h-60">
            <ul className="flex flex-col gap-2">
              <li className="flex items-center gap-2">
                <Globe className="text-primary size-4" />
                Página web personalizada de reservas
              </li>
              <li className="flex items-center gap-2">
                <CalendarDays className="text-primary size-4" />
                {plan.maxSchedules === 1 ? (
                  <>Solo una agenda</>
                ) : (
                  <>hasta {plan.maxSchedules} agendas</>
                )}
              </li>
              <li className="flex items-center gap-2">
                <Book className="text-primary size-4" />
                {plan.maxSppointmentsPerSchedule} turnos por agenda
              </li>
              <li className="flex items-center gap-2">
                <BriefcaseBusiness className="text-primary size-4" />
                {plan.multipleBusinessHours
                  ? "Horarios de atención multiples"
                  : "Un solo horario de atención por día"}
              </li>
              {plan.analytics && (
                <li className="flex items-center gap-2">
                  <Bot className="text-primary size-4" />
                  <div>
                    Módulo de reportes con{" "}
                    <strong>inteligencia artificial</strong>
                  </div>
                </li>
              )}
            </ul>
          </CardContent>
          <CardFooter className="flex justify-between items-center mt-auto px-4 card-footer">
            <strong>
              {plan.price > 0 ? (
                <span>${plan.price}/mes</span>
              ) : (
                <span>Gratis</span>
              )}
            </strong>
            <PlanForm
              companyPlanId={plan.id}
              disabled={user.company.companyPlanId === plan.id}
              bestSeller={plan.bestSeller}
            />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Plans;
