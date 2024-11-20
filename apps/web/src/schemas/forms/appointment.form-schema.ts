import { z } from "zod";

export const appointmentFormSchema = z
  .object({
    scheduleId: z.string().min(1, "Requerido"),
    existingCustomer: z.boolean(),
    fromDatetime: z.date(),
    serviceId: z.string().min(1, "Requerido"),
    publicNotes: z.string().optional(),
    privateNotes: z.string().optional(),
    customerId: z.string().optional(), // Marcado como opcional inicialmente
    customerName: z.string().optional(), // Marcado como opcional inicialmente
    customerPhone: z.string().optional(), // Marcado como opcional inicialmente
    sendEmail: z.boolean(),
    totalToPay: z.coerce.number().int().positive("Debe ser mayor a cero"),
    cancellationReason: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Si existingCustomer es true, customerId debe ser obligatorio
    if (
      data.existingCustomer &&
      (!data.customerId || data.customerId.length === 0)
    ) {
      ctx.addIssue({
        code: "custom", // Especifica que es un error personalizado
        path: ["customerId"],
        message: "Debes seleccionar un cliente",
      });
    }

    // Si existingCustomer es false, customerName, customerPhone son obligatorios
    if (!data.existingCustomer) {
      if (!data.customerName || data.customerName.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["customerName"],
          message: "Requerido",
        });
      }
      if (!data.customerPhone || data.customerPhone.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["customerPhone"],
          message: "Requerido",
        });
      }
    }
  });

export const customerAppointmentFormSchema = z.object({
  scheduleId: z.string().min(1, "Requerido"),
  date: z.date(),
  time: z.string().min(1, "Requerido"),
  serviceId: z.string().min(1, "Requerido"),
  customerName: z.string().min(1, "Requerido"),
  customerPhone: z.string().min(1, "Requerido"),
  publicNotes: z.string().optional(),
});
