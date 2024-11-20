import { Suspense } from "react";
import PurchaseForm from "../_components/purchase-form";
import FormSkeleton from "@/components/common/skeletons/form-skeleton";
import { Container } from "@repo/ui/components/ui/container";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id: number }>;
}) {
  const { id } = await searchParams;

  return (
    <Container title={`Detalle de Compra # ${id}`}>
      <Suspense fallback={<FormSkeleton />}>
        <PurchaseForm purchaseId={id} />
      </Suspense>
    </Container>
  );
}
