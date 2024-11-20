import { z } from "zod";

export const configurationFormSchema = z.object({
  name: z.string().min(1, "Requerido"),
  companyCategoryId: z.string().min(1, "Requerido"),
  description: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  email: z.string().email("Email inválido").min(1, "Requerido"),
  slug: z.string().min(1, "Requerido").max(56, "Máximo 56 caracteres"),
  welcomeText: z.string().optional(),
  logo: z.string().optional(),
  headerImage: z.string().optional(),
  webReservations: z.boolean(),
  webPayments: z.boolean(),
  webServicesVisibility: z.string(),
  showPersonInChargeReservation: z.boolean(),
  canCreatePastAppointments: z.boolean(),
  whatsapp: z.string().min(1, "Requerido"),
  phoneNumber: z.string().optional(),
});
