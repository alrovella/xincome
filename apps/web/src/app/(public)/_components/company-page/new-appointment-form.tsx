"use client";
import { Calendar } from "@repo/ui/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Button } from "@repo/ui/components/ui/button";
import { useState } from "react";
import { CalendarCheck, CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@repo/ui/components/ui/alert-dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@repo/ui/components/ui/popover";
import { cn } from "@repo/ui/lib/utils";
import { es } from "date-fns/locale";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useGetServicesBySchedule } from "@/hooks/queries/useGetServices";
import { createAppointmenByCustomer } from "@/server/actions/appointments";
import { customerAppointmentFormSchema } from "@/schemas/forms/appointment.form-schema";
import { useCompanyPublic } from "@/providers/company-public-provider";
import { useRouter } from "next/navigation";

const NewAppointmentForm = () => {
  const company = useCompanyPublic();
  const [processed, setProcessed] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { data: services } = useGetServicesBySchedule({
    scheduleId: company?.schedules?.at(0)?.id as string,
  });
  const form = useForm<z.infer<typeof customerAppointmentFormSchema>>({
    resolver: zodResolver(customerAppointmentFormSchema),
    defaultValues: {
      scheduleId: company.schedules.filter((c) => c.active).at(0)?.id,
      serviceId: services?.at(0)?.id ?? "",
      date: addDays(new Date(), 1),
      time: "10:00",
      customerName: "",
      customerPhone: "",
    },
  });

  async function onSubmit(
    values: z.infer<typeof customerAppointmentFormSchema>
  ) {
    setProcessed(false);
    const data = await createAppointmenByCustomer({
      unsafeData: values,
      slug: company.slug as string,
    });

    if (data?.error) {
      form.setError("root", {
        message:
          data?.message ??
          `Hubo un error al querer tomar el turno. Intenta nuevamente o comunicate al ${company.whatsapp}`,
      });
    } else {
      setProcessed(true);
      router.refresh();
    }
  }

  return processed ? (
    <div className="flex flex-col justify-center items-center gap-3 h-[25vh]">
      <CalendarCheck className="text-green-600 size-20" />
      <h2 className="font-bold text-xl">Turno creado con éxito!</h2>
      <div className="text-lg">Gracias por utilizar nuestro servicio!</div>
    </div>
  ) : (
    <Form {...form}>
      <form
        className="flex flex-col gap-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="gap-4 grid grid-cols-1 py-4">
          <div className="gap-2 grid grid-cols-2 w-full">
            {company.options?.showPersonInChargeReservation && (
              <FormField
                control={form.control}
                name="scheduleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Atendido por</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(e) => {
                          field.onChange(e);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {company.schedules.map((schedule) => (
                              <SelectItem
                                key={schedule.id}
                                value={String(schedule.id)}
                              >
                                {schedule.personInCharge}
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
            )}

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

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha</FormLabel>
                  <FormControl className="flex justify-center border-input bg-background border rounded-md">
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start gap-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon />
                          {field.value ? (
                            format(field.value, "PPP", { locale: es })
                          ) : (
                            <span>Selecciona la fecha</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-1 w-auto" align="start">
                        <Calendar
                          defaultMonth={new Date(field.value)}
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setOpen(false);
                          }}
                          locale={es}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
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
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre y Apellido</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="publicNotes"
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
        </div>
        <div
          className={cn("flex", isDesktop ? "justify-end" : "justify-center")}
        >
          <Button
            type="submit"
            variant="shine"
            disabled={form.formState.isSubmitting}
            className={cn("flex", isDesktop ? "w-auto" : "w-[55vh] mt-4")}
          >
            Reservar
          </Button>
        </div>
        <AlertDialog open={!!form.formState.errors.root}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Error</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              {form.formState.errors.root && (
                <div>{form.formState.errors.root?.message}</div>
              )}
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => form.clearErrors()}>
                OK
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </Form>
  );
};

export default NewAppointmentForm;
