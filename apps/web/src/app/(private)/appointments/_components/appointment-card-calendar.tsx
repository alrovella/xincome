import { Card, CardContent } from "@repo/ui/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const AppointmentCardCalendar = ({ currentDate }: { currentDate: Date }) => {
  return (
    <Card className="bg-white shadow-md mx-auto w-full max-w-md overflow-hidden select-none">
      <CardContent className="p-0">
        <div className="text-center">
          <div className="bg-destructive mb-1 p-2 text-sm text-white">
            {format(currentDate, "LLLL yyyy", { locale: es }).toUpperCase()}
          </div>
          <div
            className="mb-1 font-bold text-4xl text-foreground dark:text-background"
            aria-label={`Día ${currentDate.getDate()}`}
          >
            {currentDate.getDate()}
          </div>
          <div className="font-medium text-foreground text-lg dark:text-background">
            {format(currentDate, "EEEE", { locale: es })}
          </div>
          <div className="font-medium text-foreground text-lg dark:text-background">
            <span>{format(currentDate, "HH:mm", { locale: es })}</span> hs
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCardCalendar;
