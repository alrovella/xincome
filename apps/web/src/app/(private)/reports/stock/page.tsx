import ProductStockCard from "@/app/(private)/dashboard/_components/product-stock-card";
import { Container } from "@repo/ui/components/ui/container";

export default function Page() {
  return (
    <Container title="Reporte de Stock">
      <ProductStockCard />
    </Container>
  );
}
