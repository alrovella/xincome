import { z } from "zod";

export const businessHourSchema = z.object({
  id: z.string().optional(),
  active: z.boolean().default(true),
  dayOfWeek: z.coerce.number().int().gt(-1, "No debe ser negativo"), // Día de la semana
  openTime: z.string().regex(/^\d{2}:\d{2}$/), // Hora de apertura en formato HH:mm
  closeTime: z.string().regex(/^\d{2}:\d{2}$/), // Hora de cierre en formato HH:mm
});

export const scheduleServiceSchema = z.object({
  serviceId: z.string(),
  scheduleId: z.string(),
});

export const scheduleFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Requerido"),
  services: z.array(scheduleServiceSchema),
  businessHours: z.array(businessHourSchema),
  active: z.boolean(),
  minDaysInAdvance: z.coerce
    .number()
    .int()
    .gt(-1, "No debe ser negativo")
    .optional(),
  maxDaysInAdvance: z.coerce
    .number()
    .int()
    .gt(-1, "No debe ser negativo")
    .optional(),
  personInCharge: z.string().optional(),
});

export type ScheduleForForms = z.infer<typeof scheduleFormSchema>;
