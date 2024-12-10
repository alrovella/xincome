import ListFilters from "@/components/common/ListFilters";
import SaleList from "./_components/sale-list";
import { Container } from "@repo/ui/components/ui/container";
import PrimaryLink from "@/components/common/links/PrimaryLink";
import { getCustomerById } from "@/server/queries/customers";
import BackButton from "@/components/common/links/BackButton";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ customerId: string }>;
}) {
  const { customerId } = await searchParams;
  const customer = await getCustomerById({ customerId });

  return (
    <Container
      title={`Ventas${customer ? ` de ${customer.name}` : ""}`}
      headerChildren={
        <>
          {customer && <BackButton>Volver</BackButton>}
          <PrimaryLink href="/sales/cart">Nueva Venta</PrimaryLink>
        </>
      }
    >
      <ListFilters showStatusSelect={true} />
      <SaleList customerId={customerId} />
    </Container>
  );
}
