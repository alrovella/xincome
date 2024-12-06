"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableHeader,
} from "@repo/ui/components/ui/table";
import EmptyStateAlert from "@/components/common/EmptyStateAlert";
import SecondaryLink from "@/components/common/links/SecondaryLink";
import ListSkeleton from "@/components/common/skeletons/ListSkeleton";
import { Pencil, Ruler } from "lucide-react";
import { useProductSizes } from "@/hooks/queries/useProductSizes";
import DeleteAlertDialog from "@/components/common/DeleteAlertDialog";
import toast from "react-hot-toast";
import { deleteProductSize } from "@/server/actions/product-sizes";
import { useTransition } from "react";

const ProductSizeList = () => {
  const { data, isLoading, isRefetching, refetch } = useProductSizes();
  const [isDeleting, deleteTransition] = useTransition();

  const handleDelete = async (id: number) => {
    deleteTransition(async () => {
      try {
        const data = await deleteProductSize(id);

        if (data.error) {
          toast.error(data.message);
        } else {
          toast.success(data.message);
          refetch();
        }
      } catch (error) {
        toast.success((error as Error).message);
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
              <Ruler className="mb-4 text-destructive size-12" />
              <h2 className="mb-2 font-semibold text-2xl">
                No hay talles disponibles
              </h2>
              <p className="text-sm">
                En este momento no hay talles registrados en el sistema.
              </p>
            </EmptyStateAlert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/0">
                  <TableHead className="w-1/3">Nombre</TableHead>
                  <TableHead> </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((size) => (
                  <TableRow key={size.id}>
                    <TableCell className="font-medium">{size.name}</TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <SecondaryLink href={`/product-sizes/edit?id=${size.id}`}>
                        <Pencil className="w-4 h-4" />
                      </SecondaryLink>

                      <DeleteAlertDialog
                        description="Seguro de eliminar el talle?"
                        onDelete={() => handleDelete(size.id)}
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

export default ProductSizeList;
