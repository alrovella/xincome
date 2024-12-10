import { getSupplier } from "@/server/queries/suppliers";
import SupplierForm from "../_components/suppliers-form";
import { Container } from "@repo/ui/components/ui/container";
import FormSkeleton from "@/components/common/skeletons/FormSkeleton";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) {
  const { id } = await searchParams;
  const supplier = await getSupplier({ supplierId: id });

  return (
    <Container title={`${supplier ? "Editar" : "Nuevo"} Proveedor`}>
      <Suspense fallback={<FormSkeleton />}>
        <SupplierForm supplier={supplier} />
      </Suspense>
    </Container>
  );
}
