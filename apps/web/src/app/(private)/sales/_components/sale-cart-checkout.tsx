"use client";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@repo/ui/components/ui/alert-dialog";

import { Input } from "@repo/ui/components/ui/input";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
} from "@repo/ui/components/ui/table";
import { Button } from "@repo/ui/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import CartTable from "@/components/common/cart-table";
import { formatPrice } from "@/util/utils";
import { useSaleStore } from "@/hooks/stores/useSaleStore";
import FormFooter from "@/components/common/forms/form-footer";
import { useRouter } from "next/navigation";
import { useBankAccounts } from "@/hooks/queries/useBankAccounts";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { saleFormSchema } from "@/schemas/forms/sale-form-schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { useState } from "react";
import FormErrorsAlert from "@/components/common/forms/form-errors-alert";
import { Textarea } from "@repo/ui/components/ui/textarea";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@repo/ui/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@repo/ui/components/ui/popover";
import { cn } from "@repo/ui/lib/utils";
import { ChevronsUpDown, Check } from "lucide-react";
import { useListCustomerItems } from "@/hooks/queries/useCustomers";
import { addSale } from "@/server/actions/sales";
import toast from "react-hot-toast";

export default function SaleCartCheckout() {
  const router = useRouter();
  const { data: bankAccounts, isLoading } = useBankAccounts();
  const { total, items, subTotal, clearItems, saleType, setSaleType } =
    useSaleStore();

  const form = useForm<z.infer<typeof saleFormSchema>>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      discount: 0,
      otherCharges: 0,
      comments: "",
      via: "PERSONAL",
    },
  });

  const { data: customers = [], isLoading: isLoadingCustomers } =
    useListCustomerItems();

  const handleClickClearCart = () => {
    clearItems();
  };

  async function onSubmit(values: z.infer<typeof saleFormSchema>) {
    const data = await addSale(items, values, saleType === "reseller");

    if (data?.error) {
      form.setError("root", {
        message: data?.message,
      });
    } else {
      toast.success(data?.message);
      clearItems();
      setSaleType("normal");
      router.push("/sales");
    }
  }

  return (
    <>
      <CartTable isPurchase={false} items={items} />
      {items.length > 0 && (
        <div className="flex flex-col">
          <AlertDialog>
            <AlertDialogTrigger className="mx-auto mb-4 w-fit" asChild>
              <Button type="button" variant="destructiveOutline">
                Vaciar Carrito
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Estas segura de vaciar el carrito?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cerrar</AlertDialogCancel>
                <AlertDialogAction onClick={handleClickClearCart}>
                  Vaciar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 sm:space-y-3"
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
                      <Input
                        type="number"
                        {...form.register("discount")}
                        className="text-right"
                        min="0"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className="text-sm md:text-base">
                    <TableCell>Otros cargos ($)</TableCell>
                    <TableCell className="text-right pr-2">
                      <Input
                        type="number"
                        {...form.register("otherCharges")}
                        className="text-right"
                        min="0"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className="font-bold text-sm md:text-lg">
                    <TableCell>Total a Pagar</TableCell>
                    <TableCell className="text-right">
                      {formatPrice(total)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="gap-2 grid grid-cols-1 lg:grid-cols-3">
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del cliente</FormLabel>
                      <FormControl>
                        <CustomerSelect
                          disabled={isLoadingCustomers}
                          items={customers}
                          onSelectedValueChange={(e) => {
                            field.onChange(
                              e?.value ? String(e.value) : undefined
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bankAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cuenta Bancaria</FormLabel>
                      <FormControl>
                        <Select
                          disabled={isLoading}
                          value={field.value ? String(field.value) : ""}
                          onValueChange={(e) => {
                            field.onChange(e);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecionar Cuenta Bancaria" />
                          </SelectTrigger>
                          <SelectContent>
                            {bankAccounts?.map((item) => (
                              <SelectItem
                                key={item.id}
                                value={item.id.toString()}
                              >
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
                  name="via"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Canal de Venta</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value ? String(field.value) : ""}
                          onValueChange={(e) => {
                            field.onChange(e);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecionar Canal de Venta" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PERSONAL">Personal</SelectItem>
                            <SelectItem value="WEB">Pagina Web</SelectItem>
                            <SelectItem value="ML">Mercado Libre</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                  variant="shine"
                  size="sm"
                  className="gap-2"
                  disabled={total < 0 || form.formState.isSubmitting}
                >
                  Realizar Venta
                </Button>
              </FormFooter>
            </form>
          </Form>
        </div>
      )}
    </>
  );
}

export function CustomerSelect({
  items,
  initialItem,
  onSelectedValueChange,
  placeholder = "Seleccionar Cliente",
  emptyStateMessage = "No hay clientes",
  disabled,
}: {
  items: { value: string; label: string }[];
  initialItem?: { value: string; label: string };
  onSelectedValueChange: (item?: { value: string; label: string }) => void;
  placeholder?: string;
  emptyStateMessage?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(initialItem);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-expanded={open}
          disabled={disabled}
          className="justify-between w-full h-[40px]"
        >
          <span>{selectedItem?.label ?? placeholder}</span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyStateMessage}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label}
                  onSelect={() => {
                    onSelectedValueChange(item);
                    setSelectedItem(item);
                    setOpen(false);
                  }}
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedItem?.value === item.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
