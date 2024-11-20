"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@repo/ui/components/ui/card";
import { Cake, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@repo/ui/lib/utils";
import { es } from "date-fns/locale";
import { useCustomerBirthdates } from "@/hooks/queries/useDashboard";
import CustomerAppointmentsDrawer from "../../customers/_components/customer-appointments-drawer";

interface CustomerBirthdaysCardProps extends React.ComponentProps<"div"> {}
const CustomerBirthdaysCard = ({ ...props }: CustomerBirthdaysCardProps) => {
  const { data, isLoading } = useCustomerBirthdates();

  const currentMonthName = format(new Date(), "LLLL", {
    locale: es,
  }).toUpperCase();
  if (!data || data?.length === 0) return <></>;
  return (
    <Card {...props} className={cn(props.className)}>
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center">
          <Cake className="mr-2 size-4" />
          Cumpleaños {currentMonthName}
        </CardDescription>
        <CardContent className="h-[150px] scrollbar">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <LoaderCircle className="animate-spin size-10" />
            </div>
          ) : (
            <>
              {data && data?.length > 0 ? (
                <>
                  {data?.map((customer) => (
                    <div
                      className="items-center gap-2 grid grid-cols-4 mb-1"
                      key={customer.id}
                    >
                      <Link
                        className="col-span-2"
                        href={`/customers/edit/${customer.id}`}
                      >
                        {customer.name}
                      </Link>
                      <div>
                        {customer.birthdate
                          ? format(customer.birthdate, "dd/MM/yyyy", {
                              locale: es,
                            })
                          : null}
                      </div>
                      <div className="flex justify-end items-center">
                        <CustomerAppointmentsDrawer
                          customerId={customer.id}
                          customerName={customer.name}
                        />
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-sm text-white">
                  No hay cumpleaños este mes
                </div>
              )}
            </>
          )}
        </CardContent>
      </CardHeader>
    </Card>
  );
};
export default CustomerBirthdaysCard;
