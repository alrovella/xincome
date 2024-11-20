import { compareCurrentWeekSalesWithLastWeek } from "@/server/queries/sales";
import { formatPrice } from "@/util/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Progress } from "@repo/ui/components/ui/progress";

const CurrentWeekSalesCard = async () => {
  const data = await compareCurrentWeekSalesWithLastWeek();
  if (!data) return null;
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardDescription>Ventas de la Semana</CardDescription>
        <CardTitle className="text-4xl">
          {formatPrice(data.currentWeekTotal)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground text-sm">
          {data.percentage}% comparado a la semana pasada
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Progress value={data.percentage} />
      </CardFooter>
    </Card>
  );
};

export default CurrentWeekSalesCard;
