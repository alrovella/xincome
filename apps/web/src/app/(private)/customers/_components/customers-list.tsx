"use client";
import { useCustomers } from "@/hooks/queries/useCustomers";
import { useSearchParams } from "next/navigation";
import ListSkeleton from "@/components/common/skeletons/ListSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import SecondaryLink from "@/components/common/links/SecondaryLink";
import { Pencil, Users } from "lucide-react";
import EmptyStateAlert from "@/components/common/EmptyStateAlert";
import CustomerAppointmentsDrawer from "./customer-appointments-drawer";
import { cn } from "@repo/ui/lib/utils";
import { buttonVariants } from "@repo/ui/components/ui/button";
import toast from "react-hot-toast";
import { deleteCustomer } from "@/server/actions/customers";
import DeleteAlertDialog from "@/components/common/DeleteAlertDialog";
import { useTransition } from "react";

const CustomerList = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const { data, isLoading, isRefetching, refetch } = useCustomers({
    page,
    limit: 10,
  });
  const [isDeleting, deleteTransition] = useTransition();

  const handleDelete = async (id: string) => {
    deleteTransition(async () => {
      const data = await deleteCustomer(id);

      if (data.error) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
        refetch();
      }
    });
  };

  return (
    <>
      {isLoading || isRefetching || isDeleting ? (
        <ListSkeleton />
      ) : (
        <>
          {data?.length === 0 ? (
            <EmptyStateAlert>
              <Users className="mb-4 text-destructive size-12" />
              <h2 className="mb-2 font-semibold text-2xl">
                No hay clientes disponibles
              </h2>
              <p className="text-sm">
                En este momento no hay clientes registrados en el sistema.
              </p>
            </EmptyStateAlert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/0">
                  <TableHead className="w-1/2">Nombre</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Telefono
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead> </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="hidden font-medium md:table-cell">
                      {item.phoneNumber}
                    </TableCell>
                    <TableCell className="hidden font-medium md:table-cell">
                      {item.email}
                    </TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <SecondaryLink href={`/customers/edit/${item.id}`}>
                        <Pencil className="w-4 h-4" />
                      </SecondaryLink>
                      <CustomerAppointmentsDrawer
                        customerId={item.id}
                        customerName={item.name}
                        buttonClassName={cn(
                          buttonVariants({ variant: "outline", size: "xs" })
                        )}
                        buttonText="Ultimos turnos"
                      />
                      <DeleteAlertDialog
                        description="Seguro de eliminar el cliente? Todos los turnos asociados a este cliente serán
                                eliminados."
                        onDelete={() => handleDelete(item.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}
    </>
  );
};

export default CustomerList;
