import { z } from "zod";

export const paymentFormSchema = z.object({
  title: z.string().min(1, "El nombre es requerido"),
  type: z.enum(["COBRANZA", "PAGO"]),
  amount: z.coerce.number().positive("Debe ser mayor a cero"),
  createdAt: z.coerce.date(),
  bankAccountId: z.coerce.number({ message: "La cuenta es requerida" }),
  comments: z.string().optional(),
  appointmentId: z.string().optional(),
});
