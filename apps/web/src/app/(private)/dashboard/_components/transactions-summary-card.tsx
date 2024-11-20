"use client";

import { formatPrice } from "@/util/utils";
import {
  CardHeader,
  CardTitle,
  Card,
  CardContent,
  CardFooter,
} from "@repo/ui/components/ui/card";

import { useBankAccountTransactionsReport } from "@/hooks/queries/useReports";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const TransactionsSummaryCard = ({
  fromDate,
  toDate,
}: {
  fromDate: Date;
  toDate: Date;
}) => {
  const currentDate = format(fromDate, "MMMM", {
    locale: es,
  }).toLocaleLowerCase();
  const { data, isLoading } = useBankAccountTransactionsReport({
    fromDate,
    toDate,
  });

  return (
    <Card className="flex flex-col bg-gradient-to-br from-gray-50 dark:from-gray-900 to-slate-50 dark:to-slate-900 h-full">
      <CardHeader>
        <CardTitle>Resumen {currentDate} </CardTitle>
      </CardHeader>
      {isLoading && (
        <CardContent className="flex flex-col gap-2">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
        </CardContent>
      )}
      {data && (
        <>
          <CardContent>
            <ul>
              <li className="flex justify-between items-center">
                Ventas: <span>{formatPrice(data?.totalSales)}</span>
              </li>
              <li className="flex justify-between items-center">
                Compras: <span>{formatPrice(data?.totalPurchases)}</span>
              </li>
              <li className="flex justify-between items-center">
                Cobranzas: <span>{formatPrice(data?.totalIncomes)}</span>
              </li>
              <li className="flex justify-between items-center">
                Pagos: <span>{formatPrice(data?.totalExpenses)}</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="flex justify-between items-center mt-auto px-5 font-bold text-primary">
            Saldo: <span>{formatPrice(data?.balance)}</span>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default TransactionsSummaryCard;
