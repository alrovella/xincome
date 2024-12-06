import EmptyStateAlert from "@/components/common/EmptyStateAlert";
import { getAllBankAccounts } from "@/server/queries/bank-accounts";
import { getLoggedInUser } from "@/server/queries/users";
import { formatPrice } from "@/util/utils";
import db from "@repo/database/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Container } from "@repo/ui/components/ui/container";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "@repo/ui/components/ui/table";
import { Landmark } from "lucide-react";

export default async function Page() {
  const accounts = await getAllBankAccounts(1, 100000);

  return (
    <Container title="Resumen de Cuentas Bancarias">
      {accounts.length === 0 ? (
        <EmptyStateAlert>
          <Landmark className="mb-4 text-destructive size-12" />
          <h2 className="mb-2 font-semibold text-2xl">
            No hay cuentas bancarias disponibles
          </h2>
          <p className="text-sm">
            En este momento no hay cuentas bancarias registradas en el sistema.
          </p>
        </EmptyStateAlert>
      ) : (
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {accounts.map((account) => (
            <Card key={account.id}>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>Cuenta Bancaria</span> {account.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BalanceDetails accountId={account.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}

async function BalanceDetails({ accountId }: Readonly<{ accountId: number }>) {
  const user = await getLoggedInUser();
  if (!user) return null;
  const sales = await db.bankAccountTransaction.findMany({
    where: {
      companyId: user.company.id,
      sale: {
        isCancelled: false,
      },
      bankAccountId: accountId,
      saleId: {
        not: null,
      },
    },
  });

  const purchases = await db.bankAccountTransaction.findMany({
    where: {
      companyId: user.company.id,
      bankAccountId: accountId,
      AND: [
        {
          purchaseId: {
            not: null,
          },
        },
        {
          purchaseId: {
            not: 2,
          },
        },
      ],
    },
  });

  const expenses = await db.bankAccountTransaction.findMany({
    where: {
      companyId: user.company.id,
      payment: {
        isCancelled: false,
        type: "PAGO",
      },
      bankAccountId: accountId,
      paymentId: {
        not: null,
      },
    },
  });

  const incomes = await db.bankAccountTransaction.findMany({
    where: {
      companyId: user.company.id,
      payment: {
        isCancelled: false,
        type: "COBRANZA",
      },
      bankAccountId: accountId,
      paymentId: {
        not: null,
      },
    },
  });

  const totalSales = sales.reduce((a, b) => a + b.amount, 0);
  const totalPurchases = purchases.reduce((a, b) => a + b.amount, 0);
  const totalExpenses = expenses.reduce((a, b) => a + b.amount, 0);
  const totalIncomes = incomes.reduce((a, b) => a + b.amount, 0);

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className="font-bold">Compras</TableCell>
          <TableCell className="text-right">
            {formatPrice(totalPurchases)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">Gastos</TableCell>
          <TableCell className="text-right">
            {formatPrice(totalExpenses)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">Ventas</TableCell>
          <TableCell className="text-right">
            {formatPrice(totalSales)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">Ingresos</TableCell>
          <TableCell className="text-right">
            {formatPrice(totalIncomes)}
          </TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="font-bold text-primary">Saldo</TableCell>
          <TableCell className="text-right font-bold text-primary">
            {formatPrice(totalSales - totalPurchases)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
