import { BookPlus } from "lucide-react";
import ServiceTable from "./_components/service-table";
import { Container } from "@repo/ui/components/ui/container";
import PrimaryLink from "@/components/common/links/PrimaryLink";

export default async function ServicesPage() {
  return (
    <Container
      title="Servicios"
      headerChildren={
        <PrimaryLink href="/services/new">
          <BookPlus className="size-4" />
          Nuevo Servicio
        </PrimaryLink>
      }
    >
      <ServiceTable />
    </Container>
  );
}
