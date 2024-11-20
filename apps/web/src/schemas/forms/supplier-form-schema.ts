import { z } from "zod";

export const supplierFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().optional(),
  phoneNumber: z.string().optional(),
  notes: z.string().optional(),
});

export type SupplierForForms = z.infer<typeof supplierFormSchema>;
