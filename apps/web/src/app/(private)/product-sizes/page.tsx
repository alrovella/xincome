import { Container } from "@repo/ui/components/ui/container";
import ProductSizeList from "./_components/product-size-list";
import PrimaryLink from "@/components/common/links/primary-link";

export default async function Page() {
  return (
    <Container
      title="Talles"
      headerChildren={
        <PrimaryLink href="/product-sizes/edit">Nuevo Talle</PrimaryLink>
      }
    >
      <ProductSizeList />
    </Container>
  );
}