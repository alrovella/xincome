"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import type { Customer } from "@repo/database";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { customerFormSchema } from "@/schemas/forms/customer-form-schema";
import { createCustomer, updateCustomer } from "@/server/actions/customers";
import FormFooter from "@/components/common/forms/FormFooter";
import EntityDatesInfo from "@/components/common/EntityDatesInfo";
import FormErrorsAlert from "@/components/common/forms/FormErrorsAlert";
import InputPhone from "@repo/ui/components/ui/phone-input";
import { format } from "date-fns";

const CustomerForm = ({ customer }: { customer?: Customer | null }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof customerFormSchema>>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: customer?.name ?? "",
      phoneNumber: customer?.phoneNumber ?? "",
      email: customer?.email ?? "",
      notes: customer?.notes ?? "",
      birthdate: customer?.birthdate
        ? format(customer?.birthdate, "yyyy-MM-dd")
        : undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof customerFormSchema>) {
    toast.loading("Guardando cliente...");

    const data = customer
      ? await updateCustomer(customer.id, values)
      : await createCustomer(values);

    toast.dismiss();

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
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Completo</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <InputPhone
                  {...field}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthdate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cumpleaños</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  onChange={field.onChange}
                  value={String(field.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea {...field} className="h-32 resize-none" />
              </FormControl>
              <FormDescription>Solo vos podes ver estas notas</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormErrorsAlert message={form.formState.errors.root?.message} />

        <EntityDatesInfo
          createdAt={customer?.createdAt}
          updatedAt={customer?.updatedAt}
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
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Guardar
          </Button>
        </FormFooter>
      </form>
    </Form>
  );
};

export default CustomerForm;
