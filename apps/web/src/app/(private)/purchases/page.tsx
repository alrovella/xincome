import ListFilters from "@/components/common/list-filters";
import PurchaseList from "./_components/purchase-list";
import { Container } from "@repo/ui/components/ui/container";
import PrimaryLink from "@/components/common/links/primary-link";

export default async function Page() {
  return (
    <Container
      title="Compras"
      headerChildren={
        <PrimaryLink href="/purchases/cart">Nueva Compra</PrimaryLink>
      }
    >
      <ListFilters showStatusSelect={false} />
      <PurchaseList />
    </Container>
  );
}
