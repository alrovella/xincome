import { z } from "zod";

export const companyPaymentMethodSchema = z.object({
  id: z.string().optional(),
  companyId: z.string(),
  paymentMethodId: z.string(),
});

export const paymentMethodSchema = z.object({
  paymentMethods: z.array(companyPaymentMethodSchema),
});

export type PaymentMethodForForms = z.infer<typeof paymentMethodSchema>;
