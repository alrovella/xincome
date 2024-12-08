import ListFilters from "@/components/common/ListFilters";
import SaleList from "./_components/sale-list";
import { Container } from "@repo/ui/components/ui/container";
import PrimaryLink from "@/components/common/links/PrimaryLink";

export default function Page() {
  return (
    <Container
      title="Ventas"
      headerChildren={<PrimaryLink href="/sales/cart">Nueva Venta</PrimaryLink>}
    >
      <ListFilters showStatusSelect={true} />
      <SaleList />
    </Container>
  );
}
