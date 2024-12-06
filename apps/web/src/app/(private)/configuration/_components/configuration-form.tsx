/* eslint-disable @next/next/no-img-element */
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
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
import toast from "react-hot-toast";
import { Button } from "@repo/ui/components/ui/button";
import {
  Globe,
  ImageIcon,
  Images,
  MapPin,
  Phone,
  Share2,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Progress } from "@repo/ui/components/ui/progress";
import { useRef, useState } from "react";
import { useEdgeStore } from "@/providers/EdgeStoreProvider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import genericHeaderImage from "@/assets/images/generic-header-image.jpg";
import { Switch } from "@repo/ui/components/ui/switch";
import { useGetCategories } from "@/hooks/queries/useGetCategories";
import { configurationFormSchema } from "@/schemas/forms/configuration-form";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { getProvinces } from "@/util/utils";
import FormFooter from "@/components/common/forms/FormFooter";
import { updateCompany } from "@/server/actions/company";
import { HelpDialog } from "@/components/common/HelpDialog";
import FormErrorsAlert from "@/components/common/forms/FormErrorsAlert";
import type { ExtendedCompany } from "@/types/entities/companies";
import InputPhone from "@repo/ui/components/ui/phone-input";
const ConfigurationForm = ({ company }: { company: ExtendedCompany }) => {
  const router = useRouter();

  const { edgestore } = useEdgeStore();
  const { data: categories } = useGetCategories();

  const inputLogoRef = useRef<HTMLInputElement>(null);
  const inputHeaderImageRef = useRef<HTMLInputElement>(null);
  const [fileLogo, setFileLogo] = useState<File>();
  const [fileHeaderImage, setFileHeaderImage] = useState<File>();
  const [uploadingLogo, setUploadingLogo] = useState<boolean>(false);
  const [uploadingHeaderImage, setUploadingHeaderImage] =
    useState<boolean>(false);
  const [progressLogo, setProgressLogo] = useState<number>(0);
  const [progressHeaderImage, setProgressHeaderImage] = useState<number>(0);

  const form = useForm<z.infer<typeof configurationFormSchema>>({
    resolver: zodResolver(configurationFormSchema),
    defaultValues: {
      name: company.name ?? "",
      companyCategoryId: company.companyCategoryId ?? "",
      slug: company.slug ?? "",
      instagram: company.instagram ?? "",
      facebook: company.facebook ?? "",
      address: company.address ?? "",
      city: company.city ?? "",
      email: company.email ?? "",
      phoneNumber: company.phoneNumber ?? "",
      welcomeText: company.welcomeText ?? "",
      logo: company.logo ?? "",
      headerImage: company.headerImage ?? "",
      province: company.province ?? "",
      whatsapp: company.whatsapp ?? "",
      webReservations: company.options?.webReservations ?? false,
      webPayments: company.options?.webPayments ?? false,
      webServicesVisibility:
        company.options?.webServicesVisibility ?? "SOLO_SERVICIOS",
      showPersonInChargeReservation:
        company.options?.showPersonInChargeReservation ?? false,
      canCreatePastAppointments:
        company.options?.canCreatePastAppointments ?? false,
    },
  });

  async function onSubmit(values: z.infer<typeof configurationFormSchema>) {
    toast.loading("Guardando configuracion...");

    const data = await updateCompany(values);

    toast.dismiss();

    if (data?.error) {
      const msg =
        data?.message ??
        "Hubo un error al querer guardar la configuración. Intenta nuevamente";

      form.setError("root", {
        message: msg,
      });
    } else {
      toast.success(data.message);
      router.push("/dashboard");
    }
  }

  return (
    <Form {...form}>
      <form
        className="space-y-4 sm:space-y-8 sm:p-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormGroupSection>
          <FormGroupHeader>
            <User className="mr-2 text-primary" /> GENERAL
          </FormGroupHeader>
          <FormFieldContainer>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Negocio</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormDescription>El nombre de tu negocio</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(e) => {
                        field.onChange(e);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar Categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categories?.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={String(category.id)}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Selecciona en que categoría se encuentra tu negocio
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="canCreatePastAppointments"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>
                      Crear turnos con fecha menor a la actual
                    </FormLabel>
                  </div>
                  <FormDescription>
                    Si habilitas esta opción, vas a poder crear turnos
                    manualmente con fechas pasadas. (solo funciona para el
                    negocio, no para el cliente)
                  </FormDescription>
                </FormItem>
              )}
            />
          </FormFieldContainer>
        </FormGroupSection>
        <FormGroupSection>
          <FormGroupHeader>
            <Globe className="mr-2 text-primary" /> PÁGINA WEB
          </FormGroupHeader>
          <FormFieldContainer>
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre para el link a tu web</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormDescription>Por ejemplo: mi-negocio</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="webServicesVisibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Servicios y Precios</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(e) => {
                        field.onChange(e);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionár Modo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value={"NO_MOSTRAR"}>
                            No mostrar
                          </SelectItem>
                          <SelectItem value={"SOLO_SERVICIOS"}>
                            Mostrar solo los servicios
                          </SelectItem>
                          <SelectItem value={"SERVICIOS_CON_PRECIOS"}>
                            Mostrar los servicios y precios
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Mostrar los servicios y precios en la página publica de tu
                    negocio.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-1 md:col-span-2">
              <FormField
                control={form.control}
                name="welcomeText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texto de bienvenida</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="h-32 resize-none" />
                    </FormControl>
                    <FormDescription>
                      El texto de bienvenida que aparecerá en la pagina web del
                      negocio
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="webReservations"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Módulo de reservas</FormLabel>
                  </div>
                  <FormDescription>
                    Si habilitas este modulo, el usuario podrá reservar turnos
                    desde la página publica de tu negocio. Tambien debes tener
                    una agenda activa
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="showPersonInChargeReservation"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>
                      Mostrar persona responsable de la agenda al reservar
                    </FormLabel>
                  </div>
                  <FormDescription>
                    Si habilitas esta opción, el usuario podrá ver el nombre de
                    la persona con la que tomará el turno. Es algo util si tenes
                    mas de una agenda.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="webPayments"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Modulo de pagos</FormLabel>
                  </div>
                  <FormDescription>
                    Si habilitas este módulo, el usuario podrá pagar sus turnos
                    desde la página publica de tu negocio. Recordá que para que
                    este módulo funcione, primero debe habilitar el{" "}
                    <strong> módulo de Reservas</strong>, como tambien conectar{" "}
                    <strong>Mercado Pago</strong>.
                  </FormDescription>
                </FormItem>
              )}
            />
          </FormFieldContainer>
        </FormGroupSection>
        <FormGroupSection>
          <FormGroupHeader>
            <Images className="mr-2 text-primary" /> DISEÑO GRAFICO
          </FormGroupHeader>
          <FormFieldContainer>
            <div>
              <FormLabel>Logo de tu negocio</FormLabel>
              <div className="flex justify-center items-center mb-2 h-40">
                {form.getValues("logo") ? (
                  <img
                    src={form.getValues("logo")}
                    className="size-32"
                    alt=""
                  />
                ) : (
                  <ImageIcon className="text-slate-200 size-32" />
                )}
              </div>
              <div className="items-center gap-2 grid grid-cols-4">
                <Input
                  type="file"
                  accept="image/*"
                  className="col-span-3"
                  ref={inputLogoRef}
                  disabled={uploadingLogo || uploadingHeaderImage}
                  onChange={(e) => {
                    setFileLogo(e.target.files?.[0]);
                  }}
                />
                <Button
                  disabled={uploadingLogo || !inputLogoRef.current?.value}
                  variant="secondary"
                  size="default"
                  onClick={async () => {
                    if (fileLogo) {
                      const res = await edgestore.publicFiles.upload({
                        file: fileLogo,
                        onProgressChange: (progress) => {
                          setProgressLogo(progress);
                          setUploadingLogo(true);
                        },
                      });
                      if (inputLogoRef.current) {
                        inputLogoRef.current.value = "";
                      }
                      setProgressLogo(0);
                      setUploadingLogo(false);
                      form.setValue("logo", res.url);
                    }
                  }}
                >
                  Subir
                </Button>
                {uploadingLogo && (
                  <Progress
                    className="col-span-4 animate-pulse"
                    value={progressLogo}
                  />
                )}
              </div>
              <FormDescription>Debe ser una imagen PNG o JPG</FormDescription>
            </div>
            <div>
              <FormLabel>Imagen encabezado</FormLabel>
              <div className="mb-2 h-40">
                {form.getValues("headerImage") ? (
                  <img
                    src={form.getValues("headerImage")}
                    className="mb-2 w-full h-40 object-cover"
                    alt=""
                  />
                ) : (
                  <img
                    src={genericHeaderImage.src}
                    alt=""
                    className="w-full h-40 object-cover"
                  />
                )}
              </div>
              <div className="items-center gap-2 grid grid-cols-4">
                <Input
                  type="file"
                  accept="image/*"
                  className="col-span-3"
                  ref={inputHeaderImageRef}
                  disabled={uploadingLogo || uploadingHeaderImage}
                  onChange={(e) => {
                    setFileHeaderImage(e.target.files?.[0]);
                  }}
                />
                <Button
                  disabled={
                    uploadingHeaderImage || !inputHeaderImageRef.current?.value
                  }
                  variant="secondary"
                  size="default"
                  onClick={async () => {
                    if (fileHeaderImage) {
                      const res = await edgestore.publicFiles.upload({
                        file: fileHeaderImage,
                        onProgressChange: (progress) => {
                          setProgressHeaderImage(progress);
                          setUploadingHeaderImage(true);
                        },
                      });
                      if (inputHeaderImageRef.current) {
                        inputHeaderImageRef.current.value = "";
                      }
                      setProgressHeaderImage(0);
                      setUploadingHeaderImage(false);
                      form.setValue("headerImage", res.url);
                    }
                  }}
                >
                  Subir
                </Button>
                {uploadingHeaderImage && (
                  <Progress
                    className="col-span-4 animate-pulse"
                    value={progressHeaderImage}
                  />
                )}
              </div>
              <FormDescription>Debe ser una imagen PNG o JPG</FormDescription>
            </div>
          </FormFieldContainer>
        </FormGroupSection>
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
                  <FormDescription>
                    Escribí la dirección del negocio
                  </FormDescription>
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
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormDescription>
                    Escribí la ciudad del negocio
                  </FormDescription>
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
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar Provincia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {getProvinces().map((province) => (
                            <SelectItem key={province} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>La provincia del negocio</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormFieldContainer>
        </FormGroupSection>
        <FormGroupSection>
          <FormGroupHeader>
            <Phone className="mr-2 text-primary" /> DATOS DE CONTACTO
          </FormGroupHeader>
          <FormFieldContainer>
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Whatsapp</FormLabel>
                  <FormControl>
                    <InputPhone
                      {...field}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Escribí el Whatsapp del negocio
                  </FormDescription>
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
                  <FormDescription>
                    Escribí el teléfono del negocio
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email del Negocio</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormDescription>El email de tu negocio</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormFieldContainer>
        </FormGroupSection>
        <FormGroupSection>
          <FormGroupHeader>
            <Share2 className="mr-2 text-primary" /> REDES SOCIALES
          </FormGroupHeader>
          <FormFieldContainer>
            <FormField
              control={form.control}
              name="instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="https://www.instagram.com/tusuario"
                    />
                  </FormControl>
                  <FormDescription>Tu link a tu instagram</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="facebook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="https://www.facebook.com/tusuario"
                    />
                  </FormControl>
                  <FormDescription>El link a tu facebook</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormFieldContainer>
        </FormGroupSection>

        <FormErrorsAlert message={form.formState.errors.root?.message} />

        <FormFooter>
          <HelpDialog
            prompt={`Hace un breve texto de que datos cargar (obligatorios y opcionales) de Company del schema prisma.
        `}
          />
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

export default ConfigurationForm;

function FormGroupHeader({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <h2 className="flex items-center mb-6 font-semibold text-foreground text-xl">
      {children}
    </h2>
  );
}

function FormFieldContainer({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="gap-6 grid grid-cols-1 md:grid-cols-2">{children}</div>
  );
}

function FormGroupSection({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="border-gray-200 pb-8 border-b">{children}</section>
  );
}
