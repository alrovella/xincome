"use client";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@repo/ui/components/ui/table";
import { formatPrice } from "@/util/utils";
import { usePurchaseStore } from "@/hooks/stores/usePurchaseStore";
import FormFooter from "@/components/common/forms/form-footer";
import { useBankAccounts } from "@/hooks/queries/useBankAccounts";
import { purchaseFormSchema } from "@/schemas/forms/purchase-form-schema";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import type { z } from "zod";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { addPurchase } from "@/server/actions/purchases";
import FormErrorsAlert from "@/components/common/forms/form-errors-alert";
import ListSkeleton from "@/components/common/skeletons/list-skeleton";
import EmptyStateAlert from "@/components/common/empty-state-alert";
import PrimaryLink from "@/components/common/links/primary-link";
import { Landmark } from "lucide-react";

const PurchaseCartCheckout = () => {
  const router = useRouter();

  const { data: bankAccounts, isLoading } = useBankAccounts();

  const { items, subTotal, total, clearItems, supplierId } = usePurchaseStore();

  const form = useForm<z.infer<typeof purchaseFormSchema>>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      discount: 0,
      comments: "",
      bankAccountTransactions: [],
      supplierId,
    },
  });

  const { fields: bankAccountTransactions } = useFieldArray({
    name: "bankAccountTransactions",
    control: form.control,
  });

  useEffect(() => {
    if (!bankAccounts) return;
    form.setValue(
      "bankAccountTransactions",
      bankAccounts?.map((bankAccount) => {
        return {
          bankAccountId: bankAccount.id,
          bankAccountName: bankAccount.name,
          amount: 0,
        };
      })
    );
  }, [bankAccounts, form]);

  async function onSubmit(values: z.infer<typeof purchaseFormSchema>) {
    toast.loading("Realizando compra...");
    const data = await addPurchase(items, values);

    if (data?.error) {
      form.setError("root", {
        message: data?.message,
      });
      toast.dismiss();
    } else {
      toast.dismiss();
      toast.success(data?.message);
      clearItems();
      router.push("/purchases");
    }
  }

  return (
    items.length > 0 && (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-8"
        >
          <Table className="bg-secondary mb-4">
            <TableBody>
              <TableRow>
                <TableCell className="w-[60%]">SubTotal</TableCell>
                <TableCell className="text-right">
                  {formatPrice(subTotal)}
                </TableCell>
              </TableRow>
              <TableRow className="text-sm md:text-base">
                <TableCell>Descuento ($)</TableCell>
                <TableCell className="text-right pr-2">
                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            className="text-right"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
              </TableRow>
              <TableRow className="font-bold text-sm md:text-lg">
                <TableCell>Total a Pagar</TableCell>
                <TableCell className="text-right">
                  {formatPrice(total - (form.watch("discount") ?? 0))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <h3 className="mb-4 font-bold">
            Asignar valores a Cuentas Bancarias
          </h3>
          {isLoading && <ListSkeleton />}
          {!isLoading && bankAccountTransactions.length === 0 && (
            <EmptyStateAlert className="gap-4">
              <div className="flex flex-col justify-center items-center gap-2">
                <Landmark className="size-8" />
                <h2 className="font-bold">No hay cuentas bancarias</h2>
                <div>Agrega una cuenta bancaria para realizar la compra</div>
              </div>
              <PrimaryLink href="/bank-accounts/edit">
                Agregar Cuenta Bancaria
              </PrimaryLink>
            </EmptyStateAlert>
          )}
          {!isLoading && bankAccountTransactions.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cuentas Bancaria</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bankAccountTransactions?.map(
                  (bankAccountTransaction, index) => (
                    <TableRow key={bankAccountTransaction.id}>
                      <TableCell className="w-[60%]">
                        {bankAccountTransaction.bankAccountName}
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          value={form.watch(
                            `bankAccountTransactions.${index}.amount`
                          )}
                          onChange={(e) => {
                            form.setValue(
                              `bankAccountTransactions.${index}.amount`,
                              Number(e.target.value)
                            );
                          }}
                          type="text"
                          className="text-right"
                        />
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          )}

          <FormField
            control={form.control}
            name="comments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comentarios</FormLabel>
                <FormControl>
                  <Textarea {...field} className="h-32 resize-none" />
                </FormControl>
                <FormDescription>Notas adicionales</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormErrorsAlert message={form.formState.errors.root?.message} />

          <FormFooter>
            <Button
              variant="outline"
              type="button"
              disabled={form.formState.isSubmitting}
              onClick={() => router.back()}
            >
              Volver
            </Button>
            <Button
              type="submit"
              variant="shine"
              disabled={!supplierId || form.formState.isSubmitting}
            >
              Realizar Compra
            </Button>
          </FormFooter>
        </form>
      </Form>
    )
  );
};

export default PurchaseCartCheckout;
