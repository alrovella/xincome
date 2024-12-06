"use client";
import { Input } from "@repo/ui/components/ui/input";
import { Textarea } from "@repo/ui/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Button } from "@repo/ui/components/ui/button";
import { CardFooter } from "@repo/ui/components/ui/card";
import { useRouter } from "next/navigation";
import type { Product } from "@repo/database";
import { useSuppliers } from "@/hooks/queries/useSuppliers";
import { useCategories } from "@/hooks/queries/useCategories";
import { productFormSchema } from "@/schemas/forms/product-form.schema";
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
import { Switch } from "@repo/ui/components/ui/switch";
import FormErrorsAlert from "@/components/common/forms/FormErrorsAlert";
import { addProduct, updateProduct } from "@/server/actions/products";
import toast from "react-hot-toast";

const ProductForm = ({ product }: { product: Product | null }) => {
  const router = useRouter();
  const { data: suppliers, isLoading: isLoadingSuppliers } = useSuppliers();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      categoryId: product?.categoryId,
      supplierId: product?.supplierId,
      price: product?.price ?? 0,
      resellerPrice: product?.resellerPrice ?? 0,
      cost: product?.cost ?? 0,
      hasSizes: product?.hasSizes ?? false,
      integratesStock: product?.integratesStock ?? true,
      keywords: product?.keywords ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof productFormSchema>) {
    toast.loading("Guardando producto...");
    const data = product
      ? await updateProduct(product.id, values)
      : await addProduct(values);

    toast.dismiss();

    if (data?.error) {
      form.setError("root", {
        message: data?.message,
      });
    } else {
      toast.success(data?.message);
      router.push("/products");
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
          name="supplierId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proveedor</FormLabel>
              <FormControl>
                <Select
                  value={field.value ? field.value : undefined}
                  onValueChange={(e) => {
                    field.onChange(e);
                  }}
                >
                  <SelectTrigger
                    className="w-full"
                    disabled={isLoadingSuppliers}
                  >
                    <SelectValue placeholder="Selecionar Proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers?.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
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
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <FormControl>
                <Select
                  value={field.value ? String(field.value) : undefined}
                  onValueChange={(e) => {
                    field.onChange(e);
                  }}
                >
                  <SelectTrigger
                    className="w-full"
                    disabled={isLoadingCategories}
                  >
                    <SelectValue placeholder="Selecionar Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((item) => (
                      <SelectItem key={item.id} value={String(item.id)}>
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripcíon</FormLabel>
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

        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Palabras clave</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio Venta</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resellerPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio Reventa</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Costo</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasSizes"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="pb-2">Producto con talles</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="integratesStock"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="pb-2">Forma parte del stock</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormErrorsAlert message={form.formState.errors.root?.message} />

        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Volver
          </Button>
          <Button type="submit">Guardar</Button>
        </CardFooter>
      </form>
    </Form>
  );
};
export default ProductForm;
