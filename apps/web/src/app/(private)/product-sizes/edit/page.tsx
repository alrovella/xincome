import { getProductSize } from "@/server/queries/product-sizes";
import ProductSizeForm from "../_components/product-size-form";
import { Container } from "@repo/ui/components/ui/container";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id: number }>;
}) {
  const { id } = await searchParams;
  const productSize = await getProductSize(id);

  return (
    <Container title={`${productSize ? "Editar" : "Nuevo"} Talle`}>
      <ProductSizeForm productSize={productSize} />
    </Container>
  );
}
