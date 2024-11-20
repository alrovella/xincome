import { compareCurrentMonthSalesWithLastMonth } from "@/server/queries/sales";
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

const CurrentMonthSalesCard = async () => {
  const data = await compareCurrentMonthSalesWithLastMonth();
  if (!data) return null;
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardDescription>Ventas del Mes</CardDescription>
        <CardTitle className="text-4xl">
          {formatPrice(data.currentMonthTotal)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-primary-foreground text-xs">
          {data.percentage}% comparado al mes pasado
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Progress value={data.percentage} />
      </CardFooter>
    </Card>
  );
};

export default CurrentMonthSalesCard;
