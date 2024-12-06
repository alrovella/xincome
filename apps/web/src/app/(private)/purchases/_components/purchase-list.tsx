"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";

import { Pencil, ShoppingCart } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import { Button } from "@repo/ui/components/ui/button";
import { usePurchases } from "@/hooks/queries/usePurchases";
import { useSearchParams } from "next/navigation";
import EmptyStateAlert from "@/components/common/EmptyStateAlert";
import ListSkeleton from "@/components/common/skeletons/ListSkeleton";
import { formatPrice } from "@/util/utils";
import SecondaryLink from "@/components/common/links/SecondaryLink";
import { format } from "date-fns";
import type { Period } from "@/util/static";

const PurchaseList = () => {
  const searchParams = useSearchParams();

  const period = searchParams.get("period")
    ? (searchParams.get("period") as (typeof Period)[number])
    : "ESTEMES";

  const {
    data: purchases,
    isLoading,
    isRefetching,
  } = usePurchases({
    period,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: 10,
    bankAccountId: searchParams.get("bankAccountId")
      ? Number(searchParams.get("bankAccountId"))
      : undefined,
  });
  return (
    <>
      {isLoading || isRefetching ? (
        <ListSkeleton />
      ) : (
        <>
          {purchases?.length === 0 && (
            <EmptyStateAlert>
              <ShoppingCart className="mb-4 text-destructive size-12" />
              <h2 className="mb-2 font-semibold text-2xl">
                No hay compras disponibles
              </h2>
              <p className="text-sm">
                En este momento no hay compras registradas en el sistema.
              </p>
            </EmptyStateAlert>
          )}
          {purchases && purchases?.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/0">
                  <TableHead className="hidden text-center md:table-cell">
                    #
                  </TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Cuentas Bancarias
                  </TableHead>
                  <TableHead className="hidden text-center md:table-cell">
                    Proveedor
                  </TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>
                    <span className="sr-only">Opciones</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="hidden text-center md:table-cell">
                      {purchase.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {format(purchase.createdAt, "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {purchase.bankAccountTransactions.length === 1 && (
                        <span>
                          {
                            purchase.bankAccountTransactions[0]?.bankAccount
                              .name
                          }
                        </span>
                      )}
                      {purchase.bankAccountTransactions.length > 1 && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="link">
                              {purchase.bankAccountTransactions.length} cuentas
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <Table>
                              <TableHeader>
                                <TableRow className="hover:bg-muted/0">
                                  <TableHead>Cuenta</TableHead>
                                  <TableHead className="text-right">
                                    Total
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {purchase.bankAccountTransactions.map(
                                  (bankAccountTransaction) => (
                                    <TableRow key={bankAccountTransaction.id}>
                                      <TableCell>
                                        {
                                          bankAccountTransaction.bankAccount
                                            .name
                                        }
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {formatPrice(
                                          bankAccountTransaction.amount
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                              </TableBody>
                            </Table>
                          </PopoverContent>
                        </Popover>
                      )}
                    </TableCell>
                    <TableCell className="hidden text-center md:table-cell">
                      {purchase.supplierName}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(purchase.total)}
                    </TableCell>
                    <TableCell className="flex justify-end">
                      <SecondaryLink href={`/purchases/edit?id=${purchase.id}`}>
                        <Pencil className="w-4 h-4" />
                      </SecondaryLink>
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

export default PurchaseList;
