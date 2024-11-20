import NotFound from "@/app/not-found";
import EntityDatesInfo from "@/components/common/entity-dates-info";
import FormFooter from "@/components/common/forms/form-footer";
import TotalSummary from "@/components/common/total-summary";
import { getPurchase } from "@/server/queries/purchases";
import { formatPrice } from "@/util/utils";
import { buttonVariants } from "@repo/ui/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { format } from "date-fns";
import Link from "next/link";

const PurchaseForm = async ({ purchaseId }: { purchaseId: number }) => {
  const purchase = await getPurchase(purchaseId);
  if (!purchase) return <NotFound />;

  const totalQuantity = purchase?.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return (
    <>
      <Table className="mb-2">
        <TableBody>
          <TableRow>
            <TableCell className="text-left">Fecha</TableCell>
            <TableCell className="text-right">
              {format(purchase.createdAt, "dd/MM/yyyy")}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-left">Proveedor</TableCell>
            <TableCell className="text-right">
              {purchase?.supplier.name}
            </TableCell>
          </TableRow>
          {purchase.comments && (
            <TableRow>
              <TableCell className="text-left">Comentarios</TableCell>
              <TableCell className="h-32">{purchase.comments}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Table className="mb-2">
        <TableHeader className="bg-muted">
          <TableRow className="hover:bg-muted/0">
            <TableHead className="font-bold">Producto</TableHead>
            <TableHead className="font-bold text-center">Talle</TableHead>
            <TableHead className="font-bold text-center">
              Cantidad ({totalQuantity})
            </TableHead>
            <TableHead className="text-right hidden font-bold sm:table-cell">
              Costo
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchase?.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.product.name}</TableCell>
              <TableCell className="text-center">
                {item.productSize?.name}
              </TableCell>
              <TableCell className="text-center">{item.quantity}</TableCell>
              <TableCell className="hidden sm:table-cell text-right">
                {formatPrice(item.cost)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TotalSummary
        subTotal={purchase?.subTotal}
        discount={purchase?.discount}
        total={purchase?.total}
      />

      {purchase?.bankAccountTransactions &&
        purchase?.bankAccountTransactions.length > 0 && (
          <>
            <h3 className="my-2 font-bold">
              Valores asignados a Cuentas Bancarias
            </h3>
            <Table className="border">
              <TableBody>
                {purchase?.bankAccountTransactions.map(
                  (bankAccountTransaction) => (
                    <TableRow key={bankAccountTransaction.bankAccountId}>
                      <TableCell className="w-[60%]">
                        {bankAccountTransaction.bankAccount.name}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPrice(bankAccountTransaction.amount)}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </>
        )}

      <EntityDatesInfo
        createdAt={purchase?.createdAt}
        updatedAt={purchase?.updatedAt}
      />

      <FormFooter>
        <Link
          className={buttonVariants({ variant: "outline" })}
          href="/purchases"
        >
          Volver
        </Link>
      </FormFooter>
    </>
  );
};

export default PurchaseForm;
