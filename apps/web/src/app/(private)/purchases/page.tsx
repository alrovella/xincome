import ListFilters from "@/components/common/ListFilters";
import PurchaseList from "./_components/purchase-list";
import { Container } from "@repo/ui/components/ui/container";
import PrimaryLink from "@/components/common/links/PrimaryLink";
import { getSupplier } from "@/server/queries/suppliers";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ supplierId: string }>;
}) {
  const { supplierId } = await searchParams;
  const supplier = await getSupplier({ supplierId });
  return (
    <Container
      title={`Compras${supplier ? ` a ${supplier.name}` : ""}`}
      headerChildren={
        <PrimaryLink href="/purchases/cart">Nueva Compra</PrimaryLink>
      }
    >
      <ListFilters showStatusSelect={false} />
      <PurchaseList supplierId={supplierId} />
    </Container>
  );
}
