import PaymentForm from "../../_components/payment-form";

export default async function EditAppointmentPage({
  params,
}: {
  params: Promise<{ appointmentId: string }>;
}) {
  const { appointmentId } = await params;

  return <PaymentForm appointmentId={appointmentId} />;
}
