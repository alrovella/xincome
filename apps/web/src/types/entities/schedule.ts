import { Schedule, BusinessHour, ScheduleService } from "@repo/database"
import { AvailabilityStatus } from "./appointment"

export type ScheduleExtended = Schedule & {
  businessHours: BusinessHour[]
  services: ScheduleService[]
}

export type BusinessHourIndexed = BusinessHour & {
  index: number
}

export type ScheduleAvailabilityResult = {
  scheduleId: string | null
  status: AvailabilityStatus
}

export type ScheduleForWeb = {
  id: string
  name: string
  services: ServiceForWeb[]
}

type ServiceForWeb = {
  id: string
  name: string
  durationInMinutes: number
  description: string | null
  price: number
}
