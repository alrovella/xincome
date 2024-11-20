"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import type { Service } from "@repo/database";
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
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BotIcon } from "lucide-react";
import { serviceFormSchema } from "@/schemas/forms/service-form-schema";
import EntityDatesInfo from "@/components/common/entity-dates-info";
import FormFooter from "@/components/common/forms/form-footer";
import { updateService, createService } from "@/server/actions/services";
import FormErrorsAlert from "@/components/common/forms/form-errors-alert";
import { askAIForHelp } from "@/server/queries/ai";

const ServiceForm = ({ service }: { service?: Service | null }) => {
  const router = useRouter();

  const handleCreateDescription = async (serviceName: string) => {
    const description = await askAIForHelp(
      `Escribí un texto para la venta de un servicio. 
       El servicio es "${serviceName}". 
       Sin exageraciones pero que sea atractivo a los ojos de los posibles clientes.
       El texto debe ser minimo de 256 caracteres hasta 1024.
       No uses simbolos ni caracteres especiales.
       `
    );
    form.setValue("description", description);
  };

  const form = useForm<z.infer<typeof serviceFormSchema>>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: service?.name ?? "",
      price: service?.price ?? 0,
      durationInMinutes: service?.durationInMinutes ?? 0,
      description: service?.description ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof serviceFormSchema>) {
    const data = service
      ? await updateService(service.id, values)
      : await createService(values);

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
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormDescription>El nombre del servicio</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormDescription>El precio del servicio</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="durationInMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duración</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormDescription>
                Duracion del servicio en minutos
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex justify-between items-center">
                Descripción
                <Button
                  type="button"
                  variant="ghost"
                  className="text-primary"
                  size="sm"
                  onClick={() => handleCreateDescription(form.getValues().name)}
                >
                  <BotIcon className="mr-2" /> Crear descripción con IA
                </Button>
              </FormLabel>
              <FormControl>
                <Textarea {...field} className="h-32 resize-none" />
              </FormControl>
              <FormDescription>La descripción del servicio</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="bg-accent/50 p-4 border rounded-md text-sm">
          <strong>Consejos Generales:</strong> Sé Claro y Descriptivo: Asegúrate
          de que el nombre del servicio indique claramente lo que ofreces. Usa
          Términos Reconocibles: Utiliza nombres que sean comprensibles y
          familiares para tus clientes. Mantén Consistencia: Usa un formato
          uniforme en todos los nombres de tus servicios y agendas para una
          mejor organización.
        </div>

        <FormErrorsAlert message={form.formState.errors.root?.message} />

        <EntityDatesInfo
          createdAt={service?.createdAt}
          updatedAt={service?.updatedAt}
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

export default ServiceForm;
