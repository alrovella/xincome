import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import ProductForm from "../_components/products-form";
import { getProduct } from "@/server/queries/products";
import { Container } from "@repo/ui/components/ui/container";
import { cn } from "@repo/ui/lib/utils";
import ProductImages from "../_components/product-images";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id: number }>;
}) {
  const { id } = await searchParams;

  const product = await getProduct(id);

  return (
    <Container title={`${product ? "Editar" : "Nuevo"} Producto`}>
      <Tabs defaultValue="info">
        {product && (
          <TabsList
            className={cn("grid", product ? "grid-cols-2" : "grid-cols-1")}
          >
            <TabsTrigger value="info">Info Producto</TabsTrigger>
            <TabsTrigger value="images">Imagenes</TabsTrigger>
          </TabsList>
        )}

        <TabsContent value="info">
          <ProductForm product={product} />
        </TabsContent>
        {product && (
          <TabsContent value="images">
            <ProductImages productId={product.id} />
          </TabsContent>
        )}
      </Tabs>
    </Container>
  );
}
