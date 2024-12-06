"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableHeader,
} from "@repo/ui/components/ui/table";
import { Pencil, Users } from "lucide-react";
import EmptyStateAlert from "@/components/common/EmptyStateAlert";
import SecondaryLink from "@/components/common/links/SecondaryLink";
import { useSuppliers } from "@/hooks/queries/useSuppliers";
import ListSkeleton from "@/components/common/skeletons/ListSkeleton";
import { deleteSupplier } from "@/server/actions/suppliers";
import toast from "react-hot-toast";
import DeleteAlertDialog from "@/components/common/DeleteAlertDialog";
import { useTransition } from "react";

const SupplierList = () => {
  const { data, isLoading, isRefetching, refetch } = useSuppliers();
  const [isDeleting, deleteTransition] = useTransition();

  const handleDelete = async (id: string) => {
    deleteTransition(async () => {
      const data = await deleteSupplier(id);

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
                No hay proveedores disponibles
              </h2>
              <p className="text-sm">
                En este momento no hay proveedores registradas en el sistema.
              </p>
            </EmptyStateAlert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/0">
                  <TableHead className="w-full">Nombre</TableHead>
                  <TableHead> </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <SecondaryLink href={`/suppliers/edit?id=${item.id}`}>
                        <Pencil className="w-4 h-4" />
                      </SecondaryLink>
                      <DeleteAlertDialog
                        description="Seguro de eliminar el proveedor?"
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

export default SupplierList;
