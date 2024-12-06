import { notFound } from "next/navigation";
import SaleForm from "../_components/sales-form";
import { getSale } from "@/server/queries/sales";
import { Container } from "@repo/ui/components/ui/container";
import { Suspense } from "react";
import FormSkeleton from "@/components/common/skeletons/FormSkeleton";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id: number }>;
}) {
  const { id } = await searchParams;
  const sale = await getSale(id);

  if (!sale) notFound();

  return (
    <Container title={`Detalle de Venta # ${sale?.id}`}>
      <Suspense fallback={<FormSkeleton />}>
        <SaleForm sale={sale} />
      </Suspense>
    </Container>
  );
}
