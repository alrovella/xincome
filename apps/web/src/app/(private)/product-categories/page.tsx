import { Container } from "@repo/ui/components/ui/container";
import CategoryList from "./_components/categories-list";
import PrimaryLink from "@/components/common/links/PrimaryLink";

export default async function Page() {
  return (
    <Container
      title="Categorías"
      headerChildren={
        <PrimaryLink href="/product-categories/edit">
          Nueva Categoría
        </PrimaryLink>
      }
    >
      <CategoryList />
    </Container>
  );
}
