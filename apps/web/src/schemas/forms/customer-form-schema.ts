import { z } from "zod";

export const customerFormSchema = z.object({
  name: z.string().min(1, "Requerido"),
  email: z.string().optional(),
  whatsapp: z.string().min(1, "Requerido"),
  phoneNumber: z.string().optional(),
  notes: z.string().optional(),
  birthdate: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  country: z.string().optional(),
});
