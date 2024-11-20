import { z } from "zod";

export const bankAccountTransactionFormSchema = z.object({
  amount: z.coerce.number().optional(),
  bankAccountName: z.string(),
  bankAccountId: z.coerce.number({ message: "La cuenta es requerida" }),
});

export const purchaseFormSchema = z.object({
  discount: z.coerce.number().optional(),
  comments: z.string().optional(),
  supplierId: z.string().min(1, "El proveedor es requerido"),
  bankAccountTransactions: z.array(bankAccountTransactionFormSchema),
});
