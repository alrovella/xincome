"use server";
import "use-server";

import db from "@repo/database/client";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { getLoggedInUser } from "./users";
import type { AppointmentPaymentsReport } from "@/types/reports";
import {
  type AppointmentLongPeriodFilter,
  getAppointmentLongPeriodFilterDescription,
} from "@/types/entities/appointment";
import { es } from "date-fns/locale";
import { format } from "date-fns/format";
import { addMonths, endOfMonth, startOfMonth } from "date-fns";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function askAIForHelp(prompt?: string) {
  if (!prompt) return "";
  const user = await getLoggedInUser();
  if (!user) return "";

  const { text } = await generateText({
    model: google("gemini-1.5-flash"),
    system: `
      Sos el asistente que brinda ayuda. Previo a la respuesta, solo escribi una oracion corta.
      No agregues caracteres especiales en tus oraciones.
      Habla en español de Argentina, sin exagerar.
      Tu cliente en este momento se llama: ${user.company.name}
      Tu cliente tiene una pagina web dentro de esta aplicacion en donde puede listar sus servicios (con descripcion y precio, por el momento sin foto)
      y sus clientes reservar turnos a traves de un formulario. La pagina web es: https//www.turnia.ar/web/${user.company.slug}
      Este es el texto que el negocio le va a transmitir a sus propios clientes: "${user.company.welcomeText}"
      Por favor, solo anda directo al grano con lo que se te pregunta. No respondas con "OK" ni nada parecido. Si podes, la respuesta devolvela en HTML.
      Cuando hagas listas usa el tag <ul> y los items de la lista con el tag <li>.
      La aplicacion se trata de un sistema de turnos para negocios de distintas categorias.
      La aplicacion puede crear distintos servicios y en cada agenda podes activar uno o mas servicios previamente cargados.
      Cada agenda tiene horarios de atencion para cada dia de la semana. podes activar o desactivar uno o mas dias en particular.
      Los horarios de atencion son 100% personalizados:
      por ejemplo, el negocio puede atender el lunes de 8 a 14, de 16 a 20; el miercoles de 8 a 13, de 14 a 21, etc.

      Para que sepas como funciona la aplicacion, te facilito el schema de prisma:
      
      model Company {
        id                      String                 @id @default(cuid())
        name                    String
        instagram               String?
        facebook                String?
        address                 String?
        city                    String?
        province                String?
        email                   String
        phone                   String?
        whatsapp                String?
        slug                    String?                @unique
        welcomeText             String?
        services                Service[]
        appointments            Appointment[]
        createdAt               DateTime               @default(now())
        updatedAt               DateTime               @updatedAt
        customers               Customer[]
        mercadoPagoOAuthToken   MercadoPagoOAuthToken?
        mercadoPagoOAuthTokenId Int?
        logo                    String?
        headerImage             String?
        active                  Boolean                @default(true)
        options                 CompanyOptions?
        schedules               Schedule[]
        businessHours           BusinessHour[]
        companyPlanId           String
        companyPlan             CompanyPlan            @relation(fields: [companyPlanId], references: [id])
        payments                AppointmentPayment[]
        users                   User[]
        category                CompanyCategory        @relation(fields: [categoryId], references: [id])
        categoryId              String
      }

      model CompanyPlan {
        id                         String    @id @default(cuid())
        name                       String
        bestSeller                 Boolean   @default(false)
        maxSchedules               Int       @default(2) // cantidad de agendas
        maxSppointmentsPerSchedule Int       @default(50) // cantidad de turnos activos por agenda
        price                      Float
        payments                   Boolean   @default(false)
        analytics                  Boolean   @default(false)
        multipleBusinessHours      Boolean   @default(false)
        companies                  Company[]
      }

      model CompanyOptions {
        id                            Int                   @id @default(autoincrement())
        webReservations               Boolean               @default(false)
        webPayments                   Boolean               @default(false) /// 
        webServicesVisibility         WebServicesVisibility @default(SOLO_SERVICIOS) //modo de mostrar los servicios en la pagina web
        showPersonInChargeReservation Boolean               @default(false) // mostrar desplegable de la persona responsable en la reserva que hace el usuario
        companyId                     String                @unique // Relación con la empresa, uno a uno
        company                       Company               @relation(fields: [companyId], references: [id], onDelete: Cascade)
      }

      enum WebServicesVisibility {
        NO_MOSTRAR
        SOLO_SERVICIOS
        SERVICIOS_CON_PRECIOS
      }

      model User {
        id        String   @id @default(cuid())
        firstName String?
        lastName  String?
        email     String
        clerkId   String   @unique
        createdAt DateTime @default(now())
        updatedAt DateTime @updatedAt
        company   Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
        companyId String
      }

      model Service {
        id                String            @id @default(cuid())
        name              String
        description       String?
        durationInMinutes Int
        price             Float
        createdAt         DateTime          @default(now())
        updatedAt         DateTime          @updatedAt
        appointments      Appointment[]
        company           Company           @relation(fields: [companyId], references: [id], onDelete: Cascade)
        companyId         String
        scheduleServices  ScheduleService[]
      }

      model Appointment {
        id                 String               @id @default(cuid())
        clerkUserId        String?
        customerId         String
        customer           Customer             @relation(fields: [customerId], references: [id])
        fromDatetime       DateTime
        toDatetime         DateTime
        publicNotes        String?
        privateNotes       String?
        totalToPay         Float
        chargeStatus       ChargeStatus         @default(NO_COBRADO)
        createdAt          DateTime             @default(now())
        updatedAt          DateTime             @updatedAt
        scheduleId         String // Relación con el horario (profesional o recurso)
        schedule           Schedule             @relation(fields: [scheduleId], references: [id], onDelete: Cascade)
        company            Company              @relation(fields: [companyId], references: [id], onDelete: Cascade)
        companyId          String
        serviceId          String
        service            Service              @relation(fields: [serviceId], references: [id], onDelete: Cascade)
        status             AppointmentStatus    @default(NO_CONFIRMADO)
        cancellationReason String?
        sentAsReminder     Boolean              @default(false) //enviado via cron al negocio
        payments           AppointmentPayment[]

        @@index([clerkUserId], name: "appointmentclerkUserIdIndex")
        @@index([scheduleId], name: "appointmentScheduleIdIndex")
      }

      model AppointmentPayment {
        id            String      @id @default(cuid())
        createdAt     DateTime    @default(now())
        updatedAt     DateTime    @updatedAt
        description   String?
        amount        Float
        cancelled     Boolean     @default(false)
        company       Company     @relation(fields: [companyId], references: [id], onDelete: Cascade)
        companyId     String
        appointment   Appointment @relation(fields: [appointmentId], references: [id], onDelete: Cascade)
        appointmentId String
      }

      model Customer {
        id           String        @id @default(cuid())
        email        String?
        name         String
        phone        String
        notes        String?
        birthdate    DateTime?
        createdAt    DateTime      @default(now())
        updatedAt    DateTime      @updatedAt
        appointments Appointment[]
        company      Company?      @relation(fields: [companyId], references: [id], onDelete: Cascade)
        companyId    String?
      }

      enum AppointmentStatus {
        NO_CONFIRMADO
        CONFIRMADO
        CANCELADO
      }

      model Schedule {
        id               String            @id @default(cuid())
        name             String // Nombre del profesional o recurso (horario)
        appointments     Appointment[] // Citas tomadas con este horario
        businessHours    BusinessHour[] // Horarios de atención de este horario
        services         ScheduleService[] // Relación con los servicios que ofrece este horario (tabla intermedia)
        minDaysInAdvance Int               @default(0) // Establece con cuántos días de anticipación mínimos se podrán reservar turnos. default: 0: se puede reservar para el mismo dia
        maxDaysInAdvance Int               @default(30) // Establece con cuántos días de anticipación se podrán reservar turnos. default: desde minDaysInAdvance + 30 dias
        personInCharge   String?
        company          Company           @relation(fields: [companyId], references: [id], onDelete: Cascade)
        companyId        String
        createdAt        DateTime          @default(now())
        updatedAt        DateTime          @updatedAt
        active           Boolean           @default(true)
      }

      model ScheduleService {
        schedule   Schedule @relation(fields: [scheduleId], references: [id], onDelete: Cascade)
        scheduleId String
        service    Service  @relation(fields: [serviceId], references: [id], onDelete: Cascade)
        serviceId  String

        @@id([scheduleId, serviceId]) // Llave primaria compuesta
      }

      model BusinessHour {
        id         String    @id @default(cuid())
        dayOfWeek  Int // Ahora es un entero (0 = Domingo, 6 = Sábado) = new Date().getUTCDay()
        openTime   DateTime // Hora de apertura  
        closeTime  DateTime // Hora de cierre  
        active     Boolean   @default(true)
        company    Company   @relation(fields: [companyId], references: [id], onDelete: Cascade)
        companyId  String
        schedule   Schedule? @relation(fields: [scheduleId], references: [id], onDelete: Cascade)
        scheduleId String?
      }

      model CompanyCategory {
        id           String    @id @default(cuid())
        name         String
        description  String
        helpText     String
        visibleInWeb Boolean   @default(true)
        companies    Company[]
      }

      enum ChargeStatus {
        NO_COBRADO
        COBRADO_PARCIALMENTE
        COBRADO
      }

      Habla coloquialmente y nunca uses los nombres de propiedades del schema cuando te pidan cosas relacionadas con el schema.
      Como el schema esta en ingles, podes traducir los nombres al español y listo.
      No uses la palabra "cita" o "citas", usa "turno" o "turnos".
      No uses simbolos ni caracteres especiales.
      `,

    prompt,
  });

  return text;
}

export async function appointmentPaymentsReport({
  period,
}: {
  period: (typeof AppointmentLongPeriodFilter)[number];
}): Promise<AppointmentPaymentsReport> {
  const user = await getLoggedInUser();

  if (!user)
    return {
      report: [],
      aiText: "",
    };

  let startDate = new Date();
  let endDate = new Date();

  switch (period) {
    case "ULTIMOS3MESES":
      startDate = startOfMonth(addMonths(new Date(), -3));
      endDate = endOfMonth(new Date());
      break;
    case "ULTIMOS6MESES":
      startDate = startOfMonth(addMonths(new Date(), -6));
      endDate = endOfMonth(new Date());
      break;
    case "ULTIMOS12MESES":
      startDate = startOfMonth(addMonths(new Date(), -12));
      endDate = endOfMonth(new Date());
      break;
    case "ULTIMOS24MESES":
      startDate = startOfMonth(addMonths(new Date(), -24));
      endDate = endOfMonth(new Date());
      break;
    case "ULTIMOS36MESES":
      startDate = startOfMonth(addMonths(new Date(), -36));
      endDate = endOfMonth(new Date());
      break;
  }

  const payments = await db.payment.findMany({
    orderBy: {
      appointment: {
        fromDatetime: "asc",
      },
    },
    where: {
      type: "COBRANZA",
      appointment: {
        fromDatetime: {
          gte: startDate,
          lte: endDate,
        },
      },
    },
    select: {
      appointment: true,
      amount: true,
    },
  });

  const reportMap: { [key: string]: number } = {};

  for (const payment of payments) {
    const monthYear = format(
      payment.appointment?.fromDatetime ?? new Date(),
      "MMMM yyyy",
      {
        locale: es,
      }
    );

    if (!reportMap[monthYear]) {
      reportMap[monthYear] = 0;
    }

    reportMap[monthYear] += payment.amount;
  }

  const data = Object.entries(reportMap).map(([monthYear, totalPayments]) => ({
    monthYear,
    totalPayments,
  }));

  const prompt = `
      Convertite en un especialista en contabilidad y analisis comercial.
      Este es un reporte de Cobranzas agrupadas por mes y año.
      Dame consejos o recomendaciones a partir de este reporte:
      Nombre del Reporte: Cobranzas por periodo. Periodo: ${getAppointmentLongPeriodFilterDescription(period)}
      ${JSON.stringify(data, null, 2)}
      Pero no me expliques lo que ya explica el reporte en si.
      Hace un texto de aproximadamente 512 caracteres respondiendo:
      Que acciones debo tomar si es que tengo que tomar acciones?
     Que pronosticos podes llegar a darme de acuerdo a lo que ves en el reporte?
      No me respondas a mi, el texto que me des tiene que ser como un reporte.
      Formatealo con HTML, asi queda mas legible.
      No uses caracteres especiales ni esteriscos.
    `;

  const aiText = await askAIForHelp(prompt);

  return { report: data, aiText } as AppointmentPaymentsReport;
}
