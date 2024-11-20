"use client";
import type { Supplier } from "@repo/database";
import { Button } from "@repo/ui/components/ui/button";
import { useRouter } from "next/navigation";
import { supplierFormSchema } from "@/schemas/forms/supplier-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import FormFooter from "@/components/common/forms/form-footer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import FormErrorsAlert from "@/components/common/forms/form-errors-alert";
import { addSupplier, updateSupplier } from "@/server/actions/suppliers";
import toast from "react-hot-toast";
import EntityDatesInfo from "@/components/common/entity-dates-info";
import { Textarea } from "@repo/ui/components/ui/textarea";
import InputPhone from "@repo/ui/components/ui/phone-input";

const SupplierForm = ({ supplier }: { supplier: Supplier | null }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof supplierFormSchema>>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: supplier?.name ?? "",
      email: supplier?.email ?? "",
      phoneNumber: supplier?.phoneNumber ?? "",
      notes: supplier?.notes ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof supplierFormSchema>) {
    toast.loading("Guardando proveedor...");

    const data = supplier
      ? await updateSupplier(supplier.id, values)
      : await addSupplier(values);

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
          {...form.register("name")}
          render={({ field }) => (
            <FormItem className="flex flex-col justify-end h-auto md:h-22">
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          {...form.register("phoneNumber")}
          render={({ field }) => (
            <FormItem className="flex flex-col justify-end h-auto md:h-22">
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
          {...form.register("email")}
          render={({ field }) => (
            <FormItem className="flex flex-col justify-end h-auto md:h-22">
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea {...field} className="h-32 resize-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormErrorsAlert message={form.formState.errors.root?.message} />

        <EntityDatesInfo
          createdAt={supplier?.createdAt}
          updatedAt={supplier?.updatedAt}
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
          <Button type="submit">Guardar</Button>
        </FormFooter>
      </form>
    </Form>
  );
};
export default SupplierForm;
