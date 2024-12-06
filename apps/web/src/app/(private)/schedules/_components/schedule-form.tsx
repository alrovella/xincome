"use client";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Book, Clock, CheckCircle, X } from "lucide-react";
import { Switch } from "@repo/ui/components/ui/switch";
import type { BusinessHour, Service } from "@repo/database";
import { Label } from "@repo/ui/components/ui/label";
import { useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@repo/ui/components/ui/dropdown-menu";
import { format } from "date-fns";
import { useAppUser } from "@/providers/UserContextProvider";
import {
  type ScheduleForForms,
  scheduleFormSchema,
} from "@/schemas/forms/schedule-form-schema";
import EntityDatesInfo from "@/components/common/EntityDatesInfo";
import FormFooter from "@/components/common/forms/FormFooter";
import { updateSchedule, createSchedule } from "@/server/actions/schedules";
import type {
  ScheduleExtended,
  BusinessHourIndexed,
} from "@/types/entities/schedule";
import { getDayName } from "@/util/formatters";
import { createBusinessDate } from "@/util/utils";
import UpgradePlanLink from "@/components/common/UpgradePlanLink";
import FormErrorsAlert from "@/components/common/forms/FormErrorsAlert";

const ScheduleForm = ({
  schedule,
  defaultBusinessHours,
  companyServices = [],
}: {
  schedule?: ScheduleExtended | null;
  defaultBusinessHours: Partial<BusinessHour>[];
  companyServices: Service[];
}) => {
  const router = useRouter();
  const { company } = useAppUser();

  const form = useForm<ScheduleForForms>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      name: schedule?.name ?? "",
      active: schedule?.active ?? true,
      services: schedule?.services ?? [],
      businessHours:
        schedule?.businessHours
          .sort(
            (a: BusinessHour, b: BusinessHour) =>
              a.openTime.getHours() - b.openTime.getHours()
          )
          .map((b: BusinessHour) => ({
            ...b,
            openTime: b.openTime && format(b.openTime, "HH:mm"),
            closeTime: b.closeTime && format(b.closeTime, "HH:mm"),
          })) ??
        defaultBusinessHours.map((b) => ({
          ...b,
          openTime: b.openTime && format(b.openTime, "HH:mm"),
          closeTime: b.closeTime && format(b.closeTime, "HH:mm"),
        })),
      personInCharge: schedule?.personInCharge ?? "",
      minDaysInAdvance: schedule?.minDaysInAdvance ?? 0,
      maxDaysInAdvance: schedule?.maxDaysInAdvance ?? 30,
    },
  });

  const {
    fields: servicesFields,
    append,
    remove,
  } = useFieldArray({
    name: "services",
    control: form.control,
  });

  const {
    fields: businessHoursFields,
    append: appendBusinessHour,
    remove: removeBusinessHour,
  } = useFieldArray({
    name: "businessHours",
    control: form.control,
  });

  const handleRemoveService = useCallback(
    (serviceId: string) => {
      const index = servicesFields.findIndex(
        (field) => field.serviceId === serviceId
      );
      if (index !== -1) remove(index);
    },
    [servicesFields, remove]
  );

  const handleAddService = useCallback(
    (serviceId: string) => {
      append({ serviceId, scheduleId: schedule?.id ?? "" });
    },
    [append, schedule?.id]
  );

  async function onSubmit(values: ScheduleForForms) {
    const data = schedule
      ? await updateSchedule(schedule.id, values)
      : await createSchedule(values);

    if (data?.error) {
      form.setError("root", {
        message: data?.message,
      });
    } else {
      toast.success(data?.message);
      router.back();
    }
  }

  const groupedBusinessHours = businessHoursFields.reduce(
    (acc, current, index) => {
      const { dayOfWeek } = current;
      if (!acc[dayOfWeek]) {
        acc[dayOfWeek] = [];
      }

      const item = {
        ...current,
        index,
        openTime: createBusinessDate(current.openTime),
        closeTime: createBusinessDate(current.closeTime),
      } as BusinessHourIndexed;
      acc[dayOfWeek].push(item);
      return acc;
    },
    {} as Record<string, BusinessHourIndexed[]>
  );

  return (
    <Form {...form}>
      <form
        className="space-y-4 sm:space-y-8 sm:p-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <section className="border-gray-200 pb-8 border-b">
          <h2 className="flex items-center mb-6 font-semibold text-foreground text-xl">
            <Book className="mr-2 text-primary" /> GENERAL
          </h2>
          <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
            <FormField
              {...form.register("name")}
              render={({ field }) => (
                <FormItem className="flex flex-col justify-end h-auto md:h-22">
                  <FormLabel>Nombre </FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormDescription>El nombre de la Agenda</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              {...form.register("personInCharge")}
              render={({ field }) => (
                <FormItem className="flex flex-col justify-end h-auto md:h-22">
                  <FormLabel>Persona responsable</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormDescription>
                    El nombre de la persona que va a brindar atencion a los
                    servicios de esta agenda
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              {...form.register("minDaysInAdvance")}
              render={({ field }) => (
                <FormItem className="flex flex-col justify-end h-auto md:h-22">
                  <FormLabel>Minimo de dias de antelación</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormDescription>
                    El minimo de dias de antelación para realizar una reserva.
                    Si dejas cero, no se requiere antelación
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              {...form.register("maxDaysInAdvance")}
              render={({ field }) => (
                <FormItem className="flex flex-col h-auto md:h-22">
                  <FormLabel>Maximo de dias de antelación</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormDescription>
                    El maximo de dias de antelación para realizar una reserva
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              {...form.register("active")}
              render={({ field }) => (
                <FormItem className="flex flex-col justify-end h-auto md:h-22">
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <div className="h-7">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                    <FormLabel>Agenda Activa</FormLabel>
                  </div>
                  <FormDescription>
                    Activala para recibir reservas
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        </section>
        <section className="border-gray-200 pb-8 border-b">
          <h2 className="flex items-center mb-6 font-semibold text-foreground text-xl">
            <CheckCircle className="mr-2 text-primary" /> SERVICIOS
          </h2>
          <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
            {companyServices.length === 0 && (
              <div className="text-destructive">No hay Servicios</div>
            )}
            {companyServices.map((service) => (
              <div key={service.id} className="flex items-center gap-2">
                <Label className="flex items-center gap-2">
                  <Switch
                    checked={
                      servicesFields.filter(
                        (field) => field.serviceId === service.id
                      ).length > 0
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleAddService(service.id);
                      } else {
                        handleRemoveService(service.id);
                      }
                    }}
                  />
                  {service.name}
                </Label>
              </div>
            ))}
          </div>
        </section>

        <section className="border-gray-200 pb-8 border-b">
          <div className="flex justify-between items-center">
            <h2 className="flex items-center mb-2 sm:mb-6 font-semibold text-foreground text-xl">
              <Clock className="mr-2 text-primary" /> HORARIOS DE ATENCION
            </h2>
            <div className="flex items-center gap-1">
              {!company.companyPlan?.multipleBusinessHours && (
                <>
                  <span>No podés agregar multiples horarios de atención</span>
                  <UpgradePlanLink />
                </>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={!company.companyPlan?.multipleBusinessHours}
                  >
                    Agregar Horario
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuGroup>
                    {[1, 2, 3, 4, 5, 6, 0].map((dayOfWeek) => (
                      <DropdownMenuItem
                        key={dayOfWeek}
                        onClick={() => {
                          appendBusinessHour({
                            dayOfWeek,
                            active: true,
                            openTime: "09:00",
                            closeTime: "18:00",
                          });
                        }}
                      >
                        {getDayName(dayOfWeek).toUpperCase()}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {businessHoursFields.length === 0 ? (
            <>Debes agregar aunque sea 1 horario de atención</>
          ) : (
            <>
              {Object.values(groupedBusinessHours).map((group) => (
                <div key={group.at(0)?.dayOfWeek}>
                  <h1 className="font-bold">
                    {getDayName(group.at(0)?.dayOfWeek ?? 0).toUpperCase()}
                  </h1>
                  {Object.values(group).map((businessHour) => {
                    return (
                      <div
                        key={businessHour.id}
                        className="gap-1 grid grid-cols-1 md:grid-cols-4 hover:bg-foreground/10 p-2 rounded-md transition-colors duration-300"
                      >
                        <Input
                          type="time"
                          value={form.watch(
                            `businessHours.${businessHour.index}.openTime`
                          )}
                          name="openTime"
                          onChange={(e) => {
                            form.setValue(
                              `businessHours.${businessHour.index}.openTime`,
                              e.target.value
                            );
                          }}
                        />
                        <Input
                          type="time"
                          value={form.watch(
                            `businessHours.${businessHour.index}.closeTime`
                          )}
                          onChange={(e) => {
                            form.setValue(
                              `businessHours.${businessHour.index}.closeTime`,
                              e.target.value
                            );
                          }}
                        />
                        <div className="flex justify-start sm:justify-center items-center gap-2 w-auto">
                          <Switch
                            checked={form.watch(
                              `businessHours.${businessHour.index}.active`
                            )}
                            onCheckedChange={(checked) => {
                              form.setValue(
                                `businessHours.${businessHour.index}.active`,
                                checked
                              );
                            }}
                          />
                          Activo
                        </div>
                        {company.companyPlan?.multipleBusinessHours && (
                          <Button
                            type="button"
                            variant="destructiveOutline"
                            size="xs"
                            onClick={() =>
                              removeBusinessHour(businessHour.index)
                            }
                          >
                            <X className="mr-2 size-4" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </>
          )}
        </section>

        <div className="bg-accent/50 p-4 border rounded-md text-sm">
          <strong>Consejos Generales:</strong> Sé Claro y Descriptivo: Asegúrate
          de que el nombre de la agenda indique claramente el tipo de
          servicios/turnos que queres agrupar. Usa Términos Reconocibles:
          Utiliza nombres que sean comprensibles y familiares para tus clientes.
          Mantén Consistencia: Usa un formato uniforme en todos los nombres de
          tus servicios y agendas para una mejor organización.
        </div>

        <EntityDatesInfo
          createdAt={schedule?.createdAt}
          updatedAt={schedule?.updatedAt}
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
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Guardar
          </Button>
        </FormFooter>
      </form>
    </Form>
  );
};

export default ScheduleForm;
