import { Container } from "@repo/ui/components/ui/container";
import CustomerForm from "../../_components/customers-form";
import NotFound from "../not-found";
import { getCustomerById } from "@/server/queries/customers";
import { Suspense } from "react";
import FormSkeleton from "@/components/common/skeletons/form-skeleton";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;

  const customer = await getCustomerById({ customerId });
  if (customer === null) return NotFound();

  return (
    <Container title={`${customer ? "Editar" : "Nuevo"} Cliente`}>
      <Suspense fallback={<FormSkeleton />}>
        <CustomerForm customer={customer} />
      </Suspense>
    </Container>
  );
}
