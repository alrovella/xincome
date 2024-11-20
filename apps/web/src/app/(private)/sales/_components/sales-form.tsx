"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { format } from "date-fns";
import { formatPrice } from "@/util/utils";
import { Button } from "@repo/ui/components/ui/button";
import TotalSummary from "@/components/common/total-summary";
import { useRouter } from "next/navigation";
import type { ExtendedSale } from "@/types/entities/sales";
import { saleEditFormSchema } from "@/schemas/forms/sale-form-schema";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { updateSale } from "@/server/actions/sales";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/components/ui/form";

const SaleForm = ({ sale }: { sale: ExtendedSale }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof saleEditFormSchema>>({
    resolver: zodResolver(saleEditFormSchema),
    defaultValues: {
      comments: sale?.comments ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof saleEditFormSchema>) {
    toast.loading("Guardando venta...");

    const data = await updateSale(sale.id, values);

    toast.dismiss();

    if (data?.error) {
      form.setError("root", {
        message: data?.message,
      });
    } else {
      toast.success(data?.message);
      router.push("/sales");
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Table className="mb-2">
          <TableBody>
            <TableRow>
              <TableCell className="w-1/3 text-left">Fecha</TableCell>
              <TableCell className="text-right">
                {format(sale.createdAt, "dd/MM/yyyy")}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-left">Canal Venta</TableCell>
              <TableCell className="text-right">{sale.via}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-left">Cliente</TableCell>
              <TableCell className="text-right">
                {sale?.customer.name}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="align-top text-left">Comentarios</TableCell>
              <TableCell className="text-right">
                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="h-32 resize-none"
                          disabled={form.formState.isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Table className="mb-2">
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Producto</TableHead>
              <TableHead className="font-bold">Talle</TableHead>
              <TableHead className="font-bold text-center">Cantidad</TableHead>
              <TableHead className="text-right font-bold">Precio</TableHead>
              <TableHead className="text-right hidden font-bold sm:table-cell">
                Total
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sale?.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.productSize?.name}</TableCell>
                <TableCell className="text-center">{item.quantity}</TableCell>
                <TableCell className="text-right">
                  {" "}
                  {formatPrice(item.price)}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-right">
                  {formatPrice(item.price * item.quantity)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TotalSummary
          subTotal={sale.subTotal}
          discount={sale?.discount}
          otherCharges={sale?.otherCharges}
          total={sale?.total}
        />

        {sale?.bankAccountTransactions.length > 0 && (
          <>
            <h3 className="my-2 font-bold">
              Valores asignados a Cuentas Bancarias
            </h3>

            <Table className="mb-4 border">
              <TableBody>
                {sale?.bankAccountTransactions.map((bankAccountTransaction) => (
                  <TableRow key={bankAccountTransaction.bankAccountId}>
                    <TableCell className="w-[60%]">
                      {bankAccountTransaction.bankAccount.name}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(bankAccountTransaction.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}

        <div className="flex justify-end items-center gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Volver
          </Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </Form>
  );
};

export default SaleForm;
