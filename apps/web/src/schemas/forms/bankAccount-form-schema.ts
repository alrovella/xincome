import { z } from "zod";

export const bankAccountFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  cbu: z.string().min(1, "El CBU es requerido"),
  alias: z.string().min(1, "El alias es requerido"),
});
