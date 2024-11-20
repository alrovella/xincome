import type { Metadata } from "next";
import AppointmentList from "./_components/appointment-list";
import { Container } from "@repo/ui/components/ui/container";
import NewAppointmentButton from "./_components/new-appointment-button";

export const metadata: Metadata = {
  title: `Turnos | ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: "Listado y administracion de turnos",
};

export default async function AppointmentsPage() {
  return (
    <Container title="Turnos" headerChildren={<NewAppointmentButton />}>
      <AppointmentList />
    </Container>
  );
}
