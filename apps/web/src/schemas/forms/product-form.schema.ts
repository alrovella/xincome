import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  price: z.coerce.number().min(1, "El precio es requerido"),
  resellerPrice: z.coerce.number().optional(),
  cost: z.coerce.number().min(0, "El costo es requerido"),
  hasSizes: z.boolean().optional(),
  integratesStock: z.boolean().optional(),
  keywords: z.string().optional(),
  supplierId: z.coerce.string().min(1, "El proveedor es requerido"),
  categoryId: z.coerce.number({ message: "La categoría es requerida" }),
});
