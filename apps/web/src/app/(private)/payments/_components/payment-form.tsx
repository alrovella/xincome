"use client";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import toast from "react-hot-toast";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@repo/ui/components/ui/select";
import FormFooter from "@/components/common/forms/FormFooter";
import FormErrorsAlert from "@/components/common/forms/FormErrorsAlert";
import { useBankAccounts } from "@/hooks/queries/useBankAccounts";
import type { Payment, PaymentType } from "@repo/database";
import { paymentFormSchema } from "@/schemas/forms/payment-form-schema";
import { addPayment, updatePayment } from "@/server/actions/payments";
import EntityDatesInfo from "@/components/common/EntityDatesInfo";

const PaymentForm = ({
  payment,
  paymentType,
}: {
  payment: Payment | null;
  paymentType: PaymentType;
}) => {
  const router = useRouter();
  const { data: bankAccounts, isLoading: isLoadingBankAccounts } =
    useBankAccounts();

  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      type: paymentType,
      createdAt: payment ? new Date(payment.createdAt) : new Date(),
      title: payment ? payment.title : "",
      amount: payment ? payment.amount : 0,
      comments: payment?.comments ?? "",
      bankAccountId: payment?.bankAccountId ?? undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof paymentFormSchema>) {
    toast.loading("Procesando...");

    const data = payment
      ? await updatePayment(payment.id, values)
      : await addPayment(values);

    toast.dismiss();

    if (data?.error) {
      form.setError("root", {
        message: data?.message,
      });
    } else {
      toast.success(data?.message);
      router.push(`/payments/${paymentType}`);
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripcion</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Importe</FormLabel>
              <FormControl>
                <Input {...field} type="text" disabled={!!payment} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          disabled={isLoadingBankAccounts}
          name="bankAccountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cuenta Bancaria</FormLabel>
              <FormControl>
                <Select
                  value={field.value ? String(field.value) : undefined}
                  onValueChange={(e) => {
                    field.onChange(e);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecionar Cuenta Bancaria" />
                  </SelectTrigger>
                  <SelectContent>
                    {bankAccounts?.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comentarios</FormLabel>
              <FormControl>
                <Textarea {...field} className="h-32 resize-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormErrorsAlert message={form.formState.errors.root?.message} />

        <EntityDatesInfo
          createdAt={payment?.createdAt}
          updatedAt={payment?.updatedAt}
        />

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
            disabled={form.formState.isSubmitting || isLoadingBankAccounts}
          >
            Guardar
          </Button>
        </FormFooter>
      </form>
    </Form>
  );
};

export default PaymentForm;
