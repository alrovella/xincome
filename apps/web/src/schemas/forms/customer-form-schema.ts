import { z } from "zod";

export const customerFormSchema = z.object({
  name: z.string().min(1, "Requerido"),
  email: z.string().optional(),
  phoneNumber: z.string().min(1, "Requerido"),
  notes: z.string().optional(),
  birthdate: z.string().optional(),
});
