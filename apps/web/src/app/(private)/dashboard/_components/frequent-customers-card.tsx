"use client";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@repo/ui/components/ui/table";
import { Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@repo/ui/lib/utils";
import { buttonVariants } from "@repo/ui/components/ui/button";
import { useFrequentCustomers } from "@/hooks/queries/useDashboard";
import type { ComponentProps } from "react";
import CustomerAppointmentsDrawer from "../../customers/_components/customer-appointments-drawer";

interface FrequentCustomersCardProps extends ComponentProps<"div"> {}

const FrequentCustomersCard = ({ ...props }: FrequentCustomersCardProps) => {
  const { data: customers } = useFrequentCustomers({
    staleTime: 5 * 60 * 1000,
  });
  if (!customers || customers?.length === 0) return <></>;
  return (
    <div {...props}>
      <h3 className="flex items-center gap-1 mb-2 font-bold text-lg">
        <Users className="size-4" />
        Clientes frecuentes
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead className="text-center">Turnos</TableHead>
            <TableHead> </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers?.map((customer) => (
            <TableRow key={customer.id} className="hover:bg-background">
              <TableCell>
                <Link href={`/customers/edit/${customer.id}`}>
                  {customer.name}
                </Link>
              </TableCell>
              <TableCell className="text-center">
                {customer._count.appointments}
              </TableCell>
              <TableCell className="flex justify-end items-center gap-1">
                <CustomerAppointmentsDrawer
                  customerId={customer.id}
                  customerName={customer.name}
                  buttonText="Ultimos turnos"
                  buttonClassName={cn(
                    buttonVariants({ variant: "outline", size: "sm" })
                  )}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FrequentCustomersCard;
