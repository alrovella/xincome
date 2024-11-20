import { z } from "zod";

export const serviceFormSchema = z.object({
  name: z.string().min(1, "Requerido"),
  description: z.string().optional(),
  price: z.coerce.number().int().positive("Debe ser mayor a cero"),
  durationInMinutes: z.coerce.number().int().positive("Debe ser mayor a cero"),
});
