import { z } from "zod";

export const saleFormSchema = z.object({
  discount: z.coerce.number().optional(),
  otherCharges: z.coerce.number().optional(),
  comments: z.string().optional(),
  via: z.enum(["PERSONAL", "WEB", "ML"]),
  customerId: z.string().min(1, "El cliente es requerido"),
  bankAccountId: z.coerce.number({ message: "La cuenta es requerida" }),
});

export const saleEditFormSchema = z.object({
  comments: z.string().optional(),
});
