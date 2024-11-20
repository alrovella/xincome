"use client";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@repo/ui/components/ui/table";
import { Pencil, ShoppingBasket } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@repo/ui/components/ui/pagination";
import EmptyStateAlert from "@/components/common/empty-state-alert";
import SecondaryLink from "@/components/common/links/secondary-link";
import { useProducts } from "@/hooks/queries/useProducts";
import { useSearchParams } from "next/navigation";
import ListSkeleton from "@/components/common/skeletons/list-skeleton";
import { deleteProduct } from "@/server/actions/products";
import toast from "react-hot-toast";
import DeleteAlertDialog from "@/components/common/delete-alert-dialog";
import { useTransition } from "react";

const ProductList = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const {
    data: products,
    isLoading,
    isRefetching,
    refetch,
  } = useProducts({ page: 1, limit: 10 });
  const [isDeleting, deleteTransition] = useTransition();

  const handleDelete = async (id: number) => {
    deleteTransition(async () => {
      const data = await deleteProduct(id);

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
          {products?.data.length === 0 && (
            <EmptyStateAlert>
              <ShoppingBasket className="mb-4 text-destructive size-12" />
              <h2 className="mb-2 font-semibold text-2xl">
                No hay productos disponibles
              </h2>
              <p className="text-sm">
                En este momento no hay productos registradas en el sistema.
              </p>
            </EmptyStateAlert>
          )}
          {products && products?.data.length > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Precio Normal
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Precio Reventa
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Costo
                    </TableHead>
                    <TableHead> </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products?.data.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>{product.categoryName}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        ${product.price}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        ${product.resellerPrice}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        ${product.cost}
                      </TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <SecondaryLink href={`/products/edit?id=${product.id}`}>
                          <Pencil className="w-4 h-4" />
                        </SecondaryLink>
                        <DeleteAlertDialog
                          description="Seguro de eliminar el producto?"
                          onDelete={() => handleDelete(product.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination>
                <PaginationContent>
                  {page > 1 && (
                    <PaginationItem>
                      <PaginationPrevious href={`/products?page=${page - 1}`} />
                    </PaginationItem>
                  )}

                  {Array.from({ length: products?.totalPages ?? 0 }, (_, i) => (
                    <PaginationItem
                      key={`index_${
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        i
                      }`}
                    >
                      <PaginationLink
                        isActive={i + 1 === page}
                        href={`/products?page=${i + 1}`}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {products && page < products?.totalPages && (
                    <PaginationItem>
                      <PaginationNext href={`/products?page=${page + 1}`} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </>
          )}
        </>
      )}
    </>
  );
};

export default ProductList;
