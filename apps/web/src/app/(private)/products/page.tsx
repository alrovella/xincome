import { Container } from "@repo/ui/components/ui/container";
import ProductList from "./_components/products-list";
import PrimaryLink from "@/components/common/links/primary-link";

export default async function Page() {
  return (
    <Container
      title="Productos"
      headerChildren={
        <PrimaryLink href="/products/edit">Nuevo Producto</PrimaryLink>
      }
    >
      <ProductList />
    </Container>
  );
}
