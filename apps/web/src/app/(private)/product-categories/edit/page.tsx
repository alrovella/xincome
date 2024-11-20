import { getProductCategory } from "@/server/queries/product-categories";
import CategoryForm from "../_components/categories-form";
import { Container } from "@repo/ui/components/ui/container";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id: number }>;
}) {
  const { id } = await searchParams;

  const category = await getProductCategory(id);

  return (
    <Container title={`${category ? "Editar" : "Nueva"} Categoría`}>
      <CategoryForm category={category ?? undefined} />
    </Container>
  );
}
