import { getPlans } from "@/server/queries/plans"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card"
import { cn } from "@repo/ui/lib/utils"
import { Book, Bot, BriefcaseBusiness, CalendarDays, Globe } from "lucide-react"

const Plans = async () => {
  const plans = await getPlans()
  if (!plans) return null

  return (
    <>
      {plans.map((plan) => (
        <Card className="flex flex-col h-full card" key={plan.id}>
          <CardHeader className="card-header">
            <CardTitle
              className={cn(
                "flex items-center justify-between",
                plan.bestSeller && "text-primary"
              )}
            >
              <span>Plan {plan.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2 mt-4">
              <li className="flex items-center gap-2 text-pretty">
                <Globe className="text-primary size-4" />
                Página web personalizada de reservas
              </li>
              <li className="flex items-center gap-2 text-pretty">
                <CalendarDays className="text-primary size-4" />
                {plan.maxSchedules == 1 ? (
                  <>Solo una agenda</>
                ) : (
                  <>hasta {plan.maxSchedules} agendas</>
                )}
              </li>
              <li className="flex items-center gap-2 text-pretty">
                <Book className="text-primary size-4" />
                {plan.maxSppointmentsPerSchedule} turnos mensuales por agenda
              </li>
              <li className="flex items-center gap-2 text-pretty">
                <BriefcaseBusiness className="text-primary size-4" />
                {plan.multipleBusinessHours
                  ? "Horarios multiples"
                  : "Una sola franja horaria por día"}
              </li>
              {plan.analytics && (
                <li className="flex items-center gap-2 text-pretty">
                  <Bot className="text-primary size-4" />
                  <div>
                    Módulo de reportes con{" "}
                    <strong>inteligencia artificial</strong>
                  </div>
                </li>
              )}
            </ul>
          </CardContent>
          <CardFooter className="mt-auto card-footer">
            <div>
              {plan.price > 0 ? (
                <span className="ml-1">Tenelo por</span>
              ) : (
                <span>Disfrutalo</span>
              )}
            </div>
            <strong className="text-xl">
              {plan.price > 0 ? (
                <span>${plan.price}/mes</span>
              ) : (
                <span>Gratis</span>
              )}
            </strong>
          </CardFooter>
        </Card>
      ))}
    </>
  )
}

export default Plans
