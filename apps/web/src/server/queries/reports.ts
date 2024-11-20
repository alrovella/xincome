"use server";
import "use-server";

import db, { type BankAccountTransaction } from "@repo/database/client";
import { getLoggedInUser } from "./users";
import { es } from "date-fns/locale";
import {
  type AppointmentLongPeriodFilter,
  type AppointmentPeriodFilter,
  getAppointmentLongPeriodFilterDescription,
  getAppointmentPeriodFilterDescription,
} from "@/types/entities/appointment";
import type {
  AppointmentPaymentsReport,
  AppointmentsByServiceReport,
  AppointmentTimelineReport,
} from "@/types/entities/reports";
import { askAIForHelp } from "./ai";
import { format } from "date-fns/format";
import {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
} from "date-fns";

export const bankAccountTransactionsReport = async ({
  fromDate,
  toDate,
}: {
  fromDate: Date;
  toDate: Date;
}) => {
  const user = await getLoggedInUser();
  if (!user)
    return {
      totalSales: 0,
      totalPurchases: 0,
      totalExpenses: 0,
      totalIncomes: 0,
      balance: 0,
    };

  const bankAccountTransactions = await db.bankAccountTransaction.findMany({
    include: { bankAccount: true, sale: true, payment: true },
    where: {
      companyId: user.company.id,
      createdAt: {
        gte: fromDate,
        lte: toDate,
      },
    },
  });

  const purchaseBankAccountTransactions = bankAccountTransactions.filter(
    (c) => c.purchaseId !== null
  );
  const saleBankAccountTransactions = bankAccountTransactions.filter(
    (c) => c.saleId !== null && !c.sale?.isCancelled
  );

  const incomeBankAccountTransactions = bankAccountTransactions.filter(
    (c) =>
      c.paymentId !== null &&
      c?.payment?.type === "COBRANZA" &&
      !c.payment?.isCancelled
  );

  const expenseBankAccountTransactions = bankAccountTransactions.filter(
    (c) =>
      c.paymentId !== null &&
      c?.payment?.type === "PAGO" &&
      !c.payment?.isCancelled
  );

  const totalSales = saleBankAccountTransactions.reduce(
    (a: number, b: Partial<BankAccountTransaction>) => a + (b.amount ?? 0),
    0
  );

  const totalPurchases = purchaseBankAccountTransactions.reduce(
    (a: number, b: Partial<BankAccountTransaction>) => a + (b.amount ?? 0),
    0
  );

  const totalExpenses = expenseBankAccountTransactions.reduce(
    (a: number, b: Partial<BankAccountTransaction>) => a + (b.amount ?? 0),
    0
  );

  const totalIncomes = incomeBankAccountTransactions.reduce(
    (a: number, b: Partial<BankAccountTransaction>) => a + (b.amount ?? 0),
    0
  );

  return {
    totalSales,
    totalPurchases,
    totalExpenses,
    totalIncomes,
    balance: totalSales + totalIncomes - totalPurchases - totalExpenses,
  };
};

// Total de turnos por servicio
// Este reporte es útil para entender la popularidad de cada servicio
// y permite a la empresa identificar cuáles servicios son más solicitados.
export async function appointmentsGroupByServiceReport({
  period,
}: {
  period: (typeof AppointmentPeriodFilter)[number];
}): Promise<AppointmentsByServiceReport> {
  const user = await getLoggedInUser();
  if (!user) return { aiText: "", report: [] };

  let from = startOfDay(new Date());
  let to = endOfDay(new Date());

  if (period === "MES") {
    from = startOfMonth(new Date());
    to = endOfMonth(new Date());
  } else if (period === "SEMANA") {
    from = startOfWeek(new Date());
    to = endOfWeek(new Date());
  } else if (period === "MESPASADO") {
    from = startOfMonth(addMonths(new Date(), -1));
    to = endOfMonth(addMonths(new Date(), -1));
  } else if (period === "ULTIMOS3MESES") {
    from = startOfMonth(addMonths(new Date(), -3));
    to = endOfMonth(new Date());
  } else if (period === "PROXIMOS3MESES") {
    from = startOfMonth(new Date());
    to = endOfMonth(addMonths(from, 3));
  } else if (period === "HOY") {
    from = startOfDay(new Date());
    to = endOfDay(new Date());
  } else if (period === "PROXIMOMES") {
    from = startOfMonth(addMonths(new Date(), 1));
    to = endOfMonth(addMonths(from, 1));
  }

  const appointmentsByService = await db.service.findMany({
    where: { companyId: user.company.id },
    select: {
      name: true,
      appointments: {
        select: {
          id: true,
        },
        where: {
          status: "CONFIRMADO",
          fromDatetime: {
            gte: from,
            lte: to,
          },
        },
      },
    },
  });

  const report = appointmentsByService
    .map((service) => ({
      serviceName: service.name,
      appointmentCount: service.appointments.length,
    }))
    .sort((a, b) => b.appointmentCount - a.appointmentCount);

  const prompt = `
      Convertite en un especialista en marketing digital y analisis comercial.
      Este es un reporte de Total de turnos por servicio.
      Este reporte es útil para entender la popularidad de cada servicio y permite a la empresa identificar cuáles servicios son más solicitados.
      Dame consejos o recomendaciones a partir de este reporte:
      Nombre del Reporte: Turnos por servicio. Periodo: ${getAppointmentPeriodFilterDescription(period)}
      ${JSON.stringify(report, null, 2)}
      Pero no me expliques lo que ya explica el reporte en si.
      Hace un texto de aproximadamente 512 caracteres respondiendo:
      Que acciones debo tomar si es que tengo que tomar acciones?
      que consejos me das para mejorar la calidad de cada uno de los servicios?
      Como mejorar la calidad de los servicios?
      Debo hacer campañas de los servicios?
      No me respondas a mi, el texto que me des tiene que ser como un reporte.
      Formatealo con HTML, asi queda mas legible.
      No uses caracteres especiales ni esteriscos.
    `;

  const aiText = await askAIForHelp(prompt);

  return { report, aiText };
}

// Cobranzas por Estado
// Un reporte de los estados de las cobranzas (COBRADO, COBRADO_PARCIALMENTE, NO_COBRADO) es útil para seguimiento de cobranzas.
export async function getPaymentsStatusReport() {
  const user = await getLoggedInUser();
  if (!user) return [];

  const paymentStatuses = await db.appointment.groupBy({
    by: ["chargeStatus"],
    _count: { chargeStatus: true },
    where: { companyId: user.company.id },
  });

  return paymentStatuses.map((status) => ({
    status: status.chargeStatus.replace("_", " "),
    count: status._count.chargeStatus,
  }));
}

export async function appointmentsTimelineReport({
  period,
}: {
  period: (typeof AppointmentLongPeriodFilter)[number];
}): Promise<AppointmentTimelineReport> {
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

  const appointments = await db.appointment.findMany({
    orderBy: { fromDatetime: "asc" },
    where: {
      companyId: user.company.id,
      fromDatetime: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      fromDatetime: true,
      status: true,
    },
  });

  const reportMap: { [key: string]: { confirmed: number; cancelled: number } } =
    {};

  for (const appointment of appointments) {
    // Extrae mes y año de la fecha en formato "YYYY-MM"
    const monthYear = format(appointment.fromDatetime, "MMMM yyyy", {
      locale: es,
    });

    if (!reportMap[monthYear]) {
      reportMap[monthYear] = { confirmed: 0, cancelled: 0 };
    }

    if (appointment.status === "CONFIRMADO") {
      reportMap[monthYear].confirmed += 1;
    } else if (appointment.status === "CANCELADO") {
      reportMap[monthYear].cancelled += 1;
    }
  }

  const data = Object.entries(reportMap).map(([monthYear, counts]) => ({
    monthYear,
    confirmedAppointments: counts.confirmed,
    cancelledAppointments: counts.cancelled,
  }));

  const prompt = `
      Convertite en un especialista en marketing digital y analisis comercial.
      Este es un reporte de Turnos confirmados vs cancelados agrupado por mes y año.
      Este reporte es útil para poder entender cuántos turnos han sido confirmados y cancelados en un periodo de tiempo determinado.
      De este modo poder tomar decisiones sobre el desempeño del negocio.
      Dame consejos o recomendaciones a partir de este reporte:
      Nombre del Reporte: Turnos confirmados vs cancelados. Periodo: ${getAppointmentLongPeriodFilterDescription(period)}
      ${JSON.stringify(data, null, 2)}
      Pero no me expliques lo que ya explica el reporte en si.
      Hace un texto de aproximadamente 512 caracteres respondiendo:
      Que acciones debo tomar si es que tengo que tomar acciones?
      Que consejos me das para mejorar la calidad de cada uno de los servicios?
      No me respondas a mi, el texto que me des tiene que ser como un reporte.
      Formatealo con HTML, asi queda mas legible.
      No uses caracteres especiales ni esteriscos.
    `;

  const aiText = await askAIForHelp(prompt);

  return { report: data, aiText } as AppointmentTimelineReport;
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
    if (payment.appointment) {
      const monthYear = format(payment.appointment.fromDatetime, "MMMM yyyy", {
        locale: es,
      });

      if (!reportMap[monthYear]) {
        reportMap[monthYear] = 0;
      }

      reportMap[monthYear] += payment.amount;
    }
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
