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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Country, State, City } from "country-state-city";
import { MapPin } from "lucide-react";
import FormGroupSection from "@/components/common/layout/form/FormGroupSection";
import FormFieldContainer from "@/components/common/layout/form/FormFieldContainer";
import FormGroupHeader from "@/components/common/layout/form/FormGroupHeader";

const CustomerForm = ({ customer }: { customer?: Customer | null }) => {
  const defaultCountryIsoCode = "AR";
  const router = useRouter();
  const countries = Country.getAllCountries().filter(
    (c) => c.isoCode === defaultCountryIsoCode
  );
  const form = useForm<z.infer<typeof customerFormSchema>>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: customer?.name ?? "",
      phoneNumber: customer?.phoneNumber ?? "",
      email: customer?.email ?? "",
      notes: customer?.notes ?? "",
      address: customer?.address ?? "",
      country: customer?.country ?? defaultCountryIsoCode,
      province: customer?.province ?? "",
      city: customer?.city ?? "",
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

        <FormGroupSection>
          <FormGroupHeader>
            <MapPin className="mr-2 text-primary" /> UBICACIÓN
          </FormGroupHeader>
          <FormFieldContainer>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>País</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(e) => {
                        field.onChange(e);
                        form.setValue("province", "");
                        form.setValue("city", "");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar País" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {countries.map((country) => (
                            <SelectItem
                              key={country.isoCode}
                              value={country.isoCode}
                            >
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provincia</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(e) => {
                        field.onChange(e);
                        form.setValue("city", "");
                      }}
                      disabled={!form.watch("country")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar Provincia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {State.getStatesOfCountry(
                            form.getValues("country")
                          ).map((province) => (
                            <SelectItem
                              key={province.isoCode}
                              value={province.isoCode}
                            >
                              {province.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciudad</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(e) => {
                        field.onChange(e);
                      }}
                      disabled={!form.watch("province")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar Ciudad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {City.getCitiesOfState(
                            form.watch("country") as string,
                            form.watch("province") as string
                          ).map((city) => (
                            <SelectItem key={city.name} value={city.name}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormFieldContainer>
        </FormGroupSection>

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
