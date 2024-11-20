import { z } from "zod";

export const productSizeFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
});
