import { getServices } from "@/server/queries/services";
import CustomerFilter from "./_components/customer-filter";
import CustomerList from "./_components/customers-list";
import { Container } from "@repo/ui/components/ui/container";
import PrimaryLink from "@/components/common/links/PrimaryLink";

export default async function CustomersPage() {
  const services = await getServices();

  return (
    <Container
      title="Clientes"
      headerChildren={
        <PrimaryLink href="/customers/new">Nuevo Cliente</PrimaryLink>
      }
    >
      <CustomerFilter services={services} />
      <CustomerList />
    </Container>
  );
}
