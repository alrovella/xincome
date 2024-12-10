"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableHeader,
  TableFooter,
} from "@repo/ui/components/ui/table";
import { Badge } from "@repo/ui/components/ui/badge";
import { Pencil, ShoppingCart, X } from "lucide-react";
import { useSales } from "@/hooks/queries/useSales";
import { useSearchParams } from "next/navigation";
import ListSkeleton from "@/components/common/skeletons/ListSkeleton";
import EmptyStateAlert from "@/components/common/EmptyStateAlert";
import { format } from "date-fns";
import { formatPrice } from "@/util/utils";
import SecondaryLink from "@/components/common/links/SecondaryLink";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/components/ui/alert-dialog";
import { Button } from "@repo/ui/components/ui/button";
import { cancelSale } from "@/server/actions/sales";
import toast from "react-hot-toast";
import type { Period } from "@/util/static";
import { useRouter } from "next/navigation";

const SaleList = ({ customerId }: { customerId?: string }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const period = searchParams.get("period")
    ? (searchParams.get("period") as (typeof Period)[number])
    : "ESTEMES";

  const { data, isLoading, refetch, isRefetching } = useSales({
    period,
    bankAccountId: searchParams.get("bankAccountId") ?? undefined,
    isCancelled: searchParams.get("isCancelled") === "true",
    page: Number(searchParams.get("page") ?? 1),
    limit: 10,
    customerId,
  });

  const handleCancelSale = async (saleId: number) => {
    const data = await cancelSale(saleId);

    if (data.error) {
      toast.error(data.message);
    } else {
      toast.success(data.message);
      refetch();
    }
  };

  return (
    <>
      {isLoading || isRefetching ? (
        <ListSkeleton />
      ) : (
        <>
          {data?.length === 0 && (
            <EmptyStateAlert className="flex flex-col items-center gap-2">
              <ShoppingCart className="mb-4 text-destructive size-12" />
              <h2 className="mb-2 font-semibold text-2xl">
                {customerId ? (
                  <>El cliente no tiene ventas</>
                ) : (
                  <> No hay ventas disponibles</>
                )}
              </h2>
              <p className="text-sm">
                {customerId ? (
                  <>No hay ventas relacionadas con el cliente seleccionado</>
                ) : (
                  <>En este momento no hay ventas registradas en el sistema</>
                )}
              </p>
              <div>
                {customerId ? (
                  <Button variant={"outline"} onClick={() => router.back()}>
                    Volver
                  </Button>
                ) : null}
              </div>
            </EmptyStateAlert>
          )}
          {data && data?.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/0">
                  <TableHead className="hidden md:table-cell">#</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Tipo Venta
                  </TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cuenta Bancaria</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Cliente
                  </TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>
                    <span className="sr-only">Opciones</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="hidden md:table-cell">
                      {sale.id}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant={sale.isReseller ? "default" : "outline"}
                        className="flex justify-center items-center shadow-inner w-20 select-none"
                      >
                        {sale.isReseller ? "Reventa" : "Normal"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {format(sale.createdAt, "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {sale.bankAccountName}
                    </TableCell>
                    <TableCell className="hidden text-sm md:table-cell">
                      {sale.customerName}
                    </TableCell>

                    <TableCell className="text-right">
                      {formatPrice(sale.total)}
                    </TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <SecondaryLink href={`/sales/edit?id=${sale.id}`}>
                        <Pencil className="w-4 h-4" />
                      </SecondaryLink>
                      {!sale.isCancelled && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructiveOutline" size="xs">
                              <X className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Realmente quiere cancelar la venta?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cerrar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  handleCancelSale(sale.id);
                                }}
                              >
                                Cancelar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className="hidden md:table-cell"> </TableCell>
                  <TableCell className="hidden md:table-cell"> </TableCell>
                  <TableCell className="font-medium">
                    Cantidad: {data?.length}
                  </TableCell>
                  <TableCell className="hidden text-sm md:table-cell">
                    {" "}
                  </TableCell>
                  <TableCell className="hidden text-center md:table-cell">
                    {" "}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(
                      data
                        ? data?.reduce((acc, sale) => acc + sale.total, 0)
                        : 0
                    )}
                  </TableCell>
                  <TableCell className="flex justify-end gap-2"> </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          )}
        </>
      )}
    </>
  );
};

export default SaleList;
