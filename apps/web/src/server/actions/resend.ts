import { Resend } from "resend";
import { getAppointmentById } from "../queries/appointments";
import { getLoggedInUser } from "../queries/users";
import { ViewAppointmentTemplate } from "@/components/email-templates/view-appointment";
import { getCompanyBySlug } from "../queries/companies";
import { ConfirmedAppointmentTemplate } from "@/components/email-templates/confirmed-appointment";
import { CreateAppointmentTemplate } from "@/components/email-templates/create-appointment";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendCreateAppointmentEmail = async (appointmentId: string) => {
  const appointment = await getAppointmentById(appointmentId);
  const user = await getLoggedInUser();
  if (!user) return;
  if (!appointment) return;

  await resend.emails.send({
    from: `${process.env.NEXT_PUBLIC_APP_NAME} <${process.env.RESEND_SENDER_EMAIL}>`,
    to: [appointment?.customer.email as string],
    subject: `Confirma tu turno en ${user.company.name}`,
    react: CreateAppointmentTemplate({
      appointment,
      company: user.company,
    }),
  });
};

export const sendViewAppointmentEmail = async (appointmentId: string) => {
  const appointment = await getAppointmentById(appointmentId);
  const user = await getLoggedInUser();
  if (!user) return null;
  if (!appointment) return;

  await resend.emails.send({
    from: `${process.env.NEXT_PUBLIC_APP_NAME} <${process.env.RESEND_SENDER_EMAIL}>`,
    to: [appointment?.customer.email as string],
    subject: `Datos de tu turno en ${user.company.name}`,
    react: ViewAppointmentTemplate({
      appointment,
      company: user.company,
    }),
  });
};

export const sendConfirmedAppointmentEmail = async (
  appointmentId: string,
  slug?: string
) => {
  const appointment = await getAppointmentById(appointmentId);
  const user = await getLoggedInUser();
  if (!user) return null;
  const company = slug ? await getCompanyBySlug(slug) : user?.company;
  if (!company) return;
  if (!appointment) return;

  await resend.emails.send({
    from: `${process.env.NEXT_PUBLIC_APP_NAME} <${process.env.RESEND_SENDER_EMAIL}>`,
    to: [company?.email as string],
    subject: `Turno de ${appointment.customer.name} confirmado!`,
    react: ConfirmedAppointmentTemplate({
      appointment,
    }),
  });
};

export const sendCanceledAppointmentEmail = async (appointmentId: string) => {
  const appointment = await getAppointmentById(appointmentId);
  const user = await getLoggedInUser();
  if (!user) return;
  if (!appointment) return;

  await resend.emails.send({
    from: `${process.env.NEXT_PUBLIC_APP_NAME} <${process.env.RESEND_SENDER_EMAIL}>`,
    to: [user.company.email as string],
    subject: `Turno de ${appointment.customer.name} cancelado`,
    react: ConfirmedAppointmentTemplate({
      appointment,
    }),
  });
};
