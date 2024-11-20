"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TimePicker } from "@repo/ui/components/ui/time-picker";
import type { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
  FormDescription,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Button } from "@repo/ui/components/ui/button";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import { cn } from "@repo/ui/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@repo/ui/components/ui/calendar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import { useSearchCustomer } from "@/hooks/queries/useSearchCustomer";
import { useState, useEffect } from "react";
import { AutoComplete } from "@repo/ui/components/ui/autocomplete";
import AppointmentFriendlyDatetimeLabel from "./appointment-friendly-datetime-label";
import { AppointmentCard } from "./appointment-card";
import { useGetServicesBySchedule } from "@/hooks/queries/useGetServices";
import type { ExtendedAppointment } from "@/types/entities/appointment";
import { useAppUser } from "@/providers/user-provider";
import { appointmentFormSchema } from "@/schemas/forms/appointment.form-schema";
import {
  createAppointment,
  updateAppointment,
} from "@/server/actions/appointments";
import FormFooter from "@/components/common/forms/form-footer";
import EntityDatesInfo from "@/components/common/entity-dates-info";
import FormErrorsAlert from "@/components/common/forms/form-errors-alert";

const AppointmentForm = ({
  scheduleId,
  appointment = null,
}: {
  scheduleId: string;
  appointment?: ExtendedAppointment | null;
}) => {
  const { company } = useAppUser();

  const router = useRouter();

  const { data: services } = useGetServicesBySchedule({ scheduleId });

  const [searchValue, setSearchValue] = useState<string>(
    appointment?.customer.name ?? ""
  );

  const [selectedValue, setSelectedValue] = useState<string>("");

  const { data: suggestedCustomers = [], isLoading: isLoadingCustomers } =
    useSearchCustomer({
      searchValue,
      enabled: !!searchValue && searchValue.length > 3,
    });

  const form = useForm<z.infer<typeof appointmentFormSchema>>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      scheduleId: scheduleId ?? appointment?.scheduleId,
      existingCustomer: true,
      serviceId: appointment?.serviceId ?? "",
      fromDatetime: appointment ? appointment.fromDatetime : new Date(),
      publicNotes: appointment?.publicNotes ?? "",
      privateNotes: appointment?.privateNotes ?? "",
      customerName: appointment?.customer.name ?? "",
      sendEmail: false,
      totalToPay: appointment?.totalToPay ?? 0,
      customerPhone: appointment?.customer.phoneNumber ?? "",
      customerId: appointment?.customerId ?? "",
      cancellationReason: appointment?.cancellationReason ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof appointmentFormSchema>) {
    const data = appointment
      ? await updateAppointment(appointment.id, values)
      : await createAppointment({
          unsafeData: values,
          canCreatePastAppointments:
            company?.options?.canCreatePastAppointments ?? false,
          showNoCreditsMessage: true,
        });

    if (data?.error) {
      form.setError("root", {
        message:
          data?.message ??
          "Hubo un error al querer guardar el turno. Intenta nuevamente",
      });
    } else {
      toast.success(data.message);
      router.back();
    }
  }

  useEffect(() => {
    if (searchValue.length === 0) {
      form.setValue("customerId", "");
    }
  }, [searchValue, form]);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {!appointment ? (
          <>
            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Servicio</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(e) => {
                        field.onChange(e);
                        form.setValue(
                          "totalToPay",
                          services?.find((s) => s.id === e)?.price ?? 0
                        );
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionár Servicio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {services?.map((service) => (
                            <SelectItem
                              key={service.id}
                              value={String(service.id)}
                            >
                              <span className="text-foreground">
                                {service.name}
                              </span>
                              <span className="ml-4 text-muted-foreground">
                                ({service.durationInMinutes} min)
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Elige el servicio que vas a brindar
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fromDatetime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-left">Fecha y Hora</FormLabel>
                  {appointment === null ? (
                    <>
                      <Popover>
                        <FormControl>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              disabled={appointment != null}
                              className={cn(
                                "justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 w-4 h-4" />
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy HH:mm")
                              ) : (
                                <span>Seleccioná la fecha y hora</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                        </FormControl>
                        <PopoverContent className="p-0 w-auto">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            locale={es}
                          />
                          <div className="p-3 border-t border-border">
                            <TimePicker
                              setDate={field.onChange}
                              date={field.value}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Seleccioná la fecha y hora del turno
                      </FormDescription>
                    </>
                  ) : (
                    <AppointmentFriendlyDatetimeLabel datetime={field.value} />
                  )}
                </FormItem>
              )}
            />
          </>
        ) : (
          <AppointmentCard
            appointment={appointment}
            showOptions={{
              addToGoogleCalendar: true,
              sendWhatsapp: true,
              customerInfo: true,
              lastsCustomerAppointments: true,
              appointmentPayments: true,
            }}
          />
        )}

        {appointment?.status !== "CANCELADO" && (
          <FormField
            control={form.control}
            name="totalToPay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total a Cobrar</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormDescription>El costo del servicio</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {appointment === null ? (
          <Tabs
            defaultValue={
              form.getValues("existingCustomer")
                ? "existingCustomer"
                : "newCustomer"
            }
          >
            {appointment === null ? (
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger
                  value="existingCustomer"
                  onClick={() => {
                    form.setValue("existingCustomer", true);
                  }}
                >
                  Cliente Existente
                </TabsTrigger>
                <TabsTrigger
                  value="newCustomer"
                  onClick={() => {
                    form.setValue("existingCustomer", false);
                  }}
                >
                  Nuevo Cliente
                </TabsTrigger>
              </TabsList>
            ) : (
              <></>
            )}

            <TabsContent className="flex flex-col gap-6" value="newCustomer">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del cliente</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormDescription>
                      El nombre de la persona que tomará el servicio
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono del cliente</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      El teléfono la persona que tomará el servicio
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            <TabsContent
              className="flex flex-col justify-start gap-6"
              value="existingCustomer"
            >
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del cliente</FormLabel>
                    <FormControl>
                      <AutoComplete
                        selectedValue={selectedValue}
                        onSelectedValueChange={(e) => {
                          setSelectedValue(e);
                          field.onChange(e);
                        }}
                        disabled={appointment !== null}
                        searchValue={searchValue}
                        onSearchValueChange={setSearchValue}
                        items={suggestedCustomers ?? []}
                        isLoading={isLoadingCustomers}
                        emptyMessage="No se encontraron clientes."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <></>
        )}

        {appointment === null ||
          (appointment.status !== "CANCELADO" && (
            <FormField
              control={form.control}
              name="publicNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas para el cliente</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="h-32 resize-none" />
                  </FormControl>
                  <FormDescription>
                    Notas que podrá ver el cliente en el email del turno
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        <FormField
          control={form.control}
          name="privateNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas Privadas</FormLabel>
              <FormControl>
                <Textarea {...field} className="h-32 resize-none" />
              </FormControl>
              <FormDescription>Solo vos podes ver estas notas</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {appointment?.status === "CANCELADO" && (
          <FormField
            control={form.control}
            name="cancellationReason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Motivo de la cancelación</FormLabel>
                <FormControl>
                  <Textarea {...field} className="h-32 resize-none" />
                </FormControl>
                <FormDescription>
                  Observaciones sobre el motivo de la cancelación
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormErrorsAlert message={form.formState.errors.root?.message} />

        <EntityDatesInfo
          createdAt={appointment?.createdAt}
          updatedAt={appointment?.updatedAt}
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

export default AppointmentForm;
