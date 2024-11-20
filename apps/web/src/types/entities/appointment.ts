import {
  type Appointment,
  AppointmentStatus,
  type ChargeStatus,
  type Customer,
  type Schedule,
  type Service,
} from "@repo/database"

export type ExtendedAppointment = Appointment & {
  service: Service
  customer: Customer
  schedule: Schedule
}

export const AppointmentLongPeriodFilter = [
  "ULTIMOS3MESES",
  "ULTIMOS6MESES",
  "ULTIMOS12MESES",
  "ULTIMOS24MESES",
  "ULTIMOS36MESES",
] as const

export const AppointmentPeriodFilter = [
  "HOY",
  "SEMANA",
  "MES",
  "PROXIMOMES",
  "PROXIMOS3MESES",
  "MESPASADO",
  "ULTIMOS3MESES",
] as const

export function getAppointmentPeriodFilters() {
  return AppointmentPeriodFilter.map((period) => ({
    key: period,
    description: getAppointmentPeriodFilterDescription(period),
  }))
}

export function getAppointmentLongPeriodFilters() {
  return AppointmentLongPeriodFilter.map((period) => ({
    key: period,
    description: getAppointmentLongPeriodFilterDescription(period),
  }))
}

export function getAppointmentPeriodFilterDescription(
  period: (typeof AppointmentPeriodFilter)[number]
) {
  switch (period) {
    case "HOY":
      return "Hoy"
    case "SEMANA":
      return "Esta semana"
    case "MES":
      return "Este mes"
    case "MESPASADO":
      return "Mes pasado"
    case "ULTIMOS3MESES":
      return "Ultimos 3 meses"
    case "PROXIMOS3MESES":
      return "Próximos 3 meses"
    case "PROXIMOMES":
      return "Próximo mes"
  }
}

export function getAppointmentLongPeriodFilterDescription(
  period: (typeof AppointmentLongPeriodFilter)[number]
) {
  switch (period) {
    case "ULTIMOS3MESES":
      return "Ultimos 3 meses"
    case "ULTIMOS6MESES":
      return "Ultimos 6 meses"
    case "ULTIMOS12MESES":
      return "Ultimos 12 meses"
    case "ULTIMOS24MESES":
      return "Ultimos 24 meses"
    case "ULTIMOS36MESES":
      return "Ultimos 36 meses"
  }
}

export enum AvailabilityStatus {
  Available = "available",
  Unavailable = "unavailable",
  OutOfBusinessHours = "out-of-business-hours",
  Unknown = "unknown",
  PastDate = "past-date",
}

export type AppointmentsFilter = {
  status?: AppointmentStatus
  period: (typeof AppointmentPeriodFilter)[number]
  customerName?: string
  chargeStatus?: ChargeStatus
  scheduleId?: string
}

export const appointmentStatuses: ReadonlyArray<AppointmentStatus> =
  Object.values(AppointmentStatus) as ReadonlyArray<AppointmentStatus>
