"use client";
import { Input } from "@repo/ui/components/ui/input";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/components/ui/button";
import FormFooter from "@/components/common/forms/form-footer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@repo/ui/components/ui/form";
import FormErrorsAlert from "@/components/common/forms/form-errors-alert";
import type { ProductSize } from "@repo/database";
import { productSizeFormSchema } from "@/schemas/forms/productSize-form-schema";
import {
  addProductSize,
  updateProductSize,
} from "@/server/actions/product-sizes";
import EntityDatesInfo from "@/components/common/entity-dates-info";

const ProductSizeForm = ({
  productSize,
}: {
  productSize: ProductSize | null;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof productSizeFormSchema>>({
    resolver: zodResolver(productSizeFormSchema),
    defaultValues: {
      name: productSize?.name ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof productSizeFormSchema>) {
    toast.loading("Guardando tamaño...");
    const data = productSize
      ? await updateProductSize(productSize.id, values)
      : await addProductSize(values);

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

        <FormErrorsAlert message={form.formState.errors.root?.message} />

        <EntityDatesInfo
          createdAt={productSize?.createdAt}
          updatedAt={productSize?.updatedAt}
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

export default ProductSizeForm;
