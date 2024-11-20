import type { Customer } from "@repo/database";
import { Button, buttonVariants } from "@repo/ui/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@repo/ui/components/ui/drawer";
import { cn } from "@repo/ui/lib/utils";
import { formatDate } from "date-fns";
import Link from "next/link";
const CustomerInfoDrawer = ({ customer }: { customer: Customer }) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Link href="" className="w-full">
          Datos del cliente
        </Link>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{customer.name}</DrawerTitle>
          </DrawerHeader>
          <div className="gap-4 grid grid-cols-1 p-4">
            <div>
              <strong>Teléfono</strong>
              <div>{customer.phoneNumber}</div>
            </div>
            {customer.email && (
              <div>
                <strong>Email</strong>
                <div>{customer.email}</div>
              </div>
            )}
            {customer.birthdate && (
              <div>
                <strong>Cumpleaños</strong>
                <div>{formatDate(customer.birthdate, "dd/MM/yyyy")}</div>
              </div>
            )}
            {customer.notes && (
              <div>
                <strong>Notas</strong>
                <div>{customer.notes}</div>
              </div>
            )}
          </div>
          <DrawerFooter>
            <Link
              className={cn(
                buttonVariants({ variant: "secondaryBordered", size: "sm" })
              )}
              href={`/customers/edit/${customer.id}`}
            >
              Editar datos
            </Link>
            <DrawerClose asChild>
              <Button variant="outline">Cerrar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CustomerInfoDrawer;
