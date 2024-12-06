"use client";
import EmptyStateAlert from "@/components/common/EmptyStateAlert";
import ListSkeleton from "@/components/common/skeletons/ListSkeleton";
import SecondaryLink from "@/components/common/links/SecondaryLink";
import { useCategories } from "@/hooks/queries/useCategories";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableHeader,
} from "@repo/ui/components/ui/table";
import { Pencil, ShoppingBag } from "lucide-react";
import { deleteCategory } from "@/server/actions/product-categories";
import toast from "react-hot-toast";
import DeleteAlertDialog from "@/components/common/DeleteAlertDialog";
import { useTransition } from "react";

const CategoryList = () => {
  const { data, isLoading, isRefetching, refetch } = useCategories();
  const [isDeleting, deleteTransition] = useTransition();

  const handleDelete = async (id: number) => {
    deleteTransition(async () => {
      try {
        const data = await deleteCategory(id);

        if (data.error) {
          toast.error(data.message);
        } else {
          toast.success(data.message);
          refetch();
        }
      } catch (error) {
        console.error(error);
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
              <ShoppingBag className="mb-4 text-destructive size-12" />
              <h2 className="mb-2 font-semibold text-2xl">
                No hay categorias disponibles
              </h2>
              <p className="text-sm">
                En este momento no hay categorias registradas en el sistema.
              </p>
            </EmptyStateAlert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/0">
                  <TableHead>Nombre</TableHead>
                  <TableHead> </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <SecondaryLink
                        href={`/product-categories/edit?id=${category.id}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </SecondaryLink>
                      <DeleteAlertDialog
                        description="Seguro de eliminar la categoria?"
                        onDelete={() => handleDelete(category.id)}
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

export default CategoryList;
