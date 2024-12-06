"use client";
import EmptyStateAlert from "@/components/common/EmptyStateAlert";
import ListSkeleton from "@/components/common/skeletons/ListSkeleton";
import SecondaryLink from "@/components/common/links/SecondaryLink";
import { usePayments } from "@/hooks/queries/usePayments";
import type { Period } from "@/util/static";
import { formatPrice, getPluralPaymentType } from "@/util/utils";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";

import { format } from "date-fns";
import { Coins, Pencil, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import type { PaymentType } from "@repo/database";
import { cancelPayment } from "@/server/actions/payments";

const PaymentsList = ({ paymentType }: { paymentType: PaymentType }) => {
  const searchParams = useSearchParams();
  const period = searchParams.get("period")
    ? (searchParams.get("period") as (typeof Period)[number])
    : "ESTEMES";

  const { data, isLoading, refetch, isRefetching } = usePayments({
    period,
    bankAccountId: searchParams.get("bankAccountId") ?? undefined,
    isCancelled: searchParams.get("isCancelled") === "true",
    page: Number(searchParams.get("page") ?? 1),
    limit: 10,
    paymentType,
  });

  return (
    <>
      {isLoading || isRefetching ? (
        <ListSkeleton />
      ) : (
        <>
          {data?.length === 0 ? (
            <EmptyStateAlert>
              <Coins className="mb-4 text-destructive size-12" />
              <h2 className="mb-2 font-semibold text-2xl">
                No hay {getPluralPaymentType(paymentType).toLocaleLowerCase()}{" "}
                disponibles
              </h2>
              <p className="text-sm">
                En este momento no hay{" "}
                {getPluralPaymentType(paymentType).toLocaleLowerCase()}{" "}
                registradas en el sistema.
              </p>
            </EmptyStateAlert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cuenta Bancaria</TableHead>
                  <TableHead className="text-right">Importe</TableHead>
                  <TableHead> </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((income) => (
                  <TableRow key={income.id}>
                    <TableCell>{income.title}</TableCell>
                    <TableCell>
                      {format(income.createdAt, "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>{income.bankAccount.name}</TableCell>
                    <TableCell className="text-right">
                      {formatPrice(income.amount)}
                    </TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <SecondaryLink
                        href={`/payments/${income.type}/edit?id=${income.id}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </SecondaryLink>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructiveOutline"
                            type="button"
                            size="xs"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Cancelar {paymentType.toLocaleLowerCase()}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Seguro de cancelar {""}
                              {paymentType.toLocaleLowerCase()}?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                cancelPayment(income.id);
                                refetch();
                              }}
                            >
                              Cancelar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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

export default PaymentsList;
