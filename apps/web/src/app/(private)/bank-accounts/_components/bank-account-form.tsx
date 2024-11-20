"use client";

import { Input } from "@repo/ui/components/ui/input";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/components/ui/button";
import FormFooter from "@/components/common/forms/form-footer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { bankAccountFormSchema } from "@/schemas/forms/bankAccount-form-schema";
import type { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@repo/ui/components/ui/form";
import FormErrorsAlert from "@/components/common/forms/form-errors-alert";
import {
  addBankAccount,
  updateBankAccount,
} from "@/server/actions/bank-accounts";
import type { BankAccount } from "@repo/database";
import EntityDatesInfo from "@/components/common/entity-dates-info";

const BankAccountForm = ({
  bankAccount,
}: {
  bankAccount: BankAccount | null;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof bankAccountFormSchema>>({
    resolver: zodResolver(bankAccountFormSchema),
    defaultValues: {
      name: bankAccount?.name ?? "",
      cbu: bankAccount?.cbu ?? "",
      alias: bankAccount?.alias ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof bankAccountFormSchema>) {
    const data = bankAccount
      ? await updateBankAccount(bankAccount.id, values)
      : await addBankAccount(values);

    if (data?.error) {
      form.setError("root", {
        message: data?.message,
      });
    } else {
      toast.success(data?.message);
      router.back();
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          {...form.register("name")}
          render={({ field }) => (
            <FormItem className="flex flex-col justify-end h-auto md:h-22">
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormDescription>El nombre de la cuenta</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          {...form.register("cbu")}
          render={({ field }) => (
            <FormItem className="flex flex-col justify-end h-auto md:h-22">
              <FormLabel>CBU</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormDescription>El cbu de la cuenta</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          {...form.register("alias")}
          render={({ field }) => (
            <FormItem className="flex flex-col justify-end h-auto md:h-22">
              <FormLabel>Alias</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormDescription>El alias de la cuenta</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormErrorsAlert message={form.formState.errors.root?.message} />

        <EntityDatesInfo
          createdAt={bankAccount?.createdAt}
          updatedAt={bankAccount?.updatedAt}
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
            variant="shine"
            disabled={form.formState.isSubmitting}
          >
            Guardar
          </Button>
        </FormFooter>
      </form>
    </Form>
  );
};

export default BankAccountForm;
