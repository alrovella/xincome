"use client";

import { Button } from "@repo/ui/components/ui/button";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import FormFooter from "@/components/common/forms/FormFooter";
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
import FormErrorsAlert from "@/components/common/forms/FormErrorsAlert";
import toast from "react-hot-toast";
import { categoryFormSchema } from "@/schemas/forms/category-form-schema";
import {
  addCategory,
  updateCategory,
} from "@/server/actions/product-categories";
import type { ProductCategory } from "@repo/database";
import EntityDatesInfo from "@/components/common/EntityDatesInfo";

const CategoryForm = ({ category }: { category?: ProductCategory }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof categoryFormSchema>) {
    toast.loading("Guardando categoría...");
    const data = category
      ? await updateCategory(category.id, values)
      : await addCategory(values);

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
              <FormDescription>El nombre de la categoría</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormErrorsAlert message={form.formState.errors.root?.message} />

        <EntityDatesInfo
          createdAt={category?.createdAt}
          updatedAt={category?.updatedAt}
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
export default CategoryForm;
