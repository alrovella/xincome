import { getPayment } from "@/server/queries/payments";
import type { PaymentType } from "@repo/database";
import { Container } from "@repo/ui/components/ui/container";
import PaymentForm from "../../_components/payment-form";
import { Suspense } from "react";
import FormSkeleton from "@/components/common/skeletons/form-skeleton";

export default async function Page({
  searchParams,
  params,
}: {
  searchParams: Promise<{ id: string }>;
  params: Promise<{ paymentType: PaymentType }>;
}) {
  const { id } = await searchParams;
  const { paymentType } = await params;
  const payment = await getPayment(id ?? undefined);

  return (
    <Container
      title={
        payment
          ? `Editar ${paymentType.toLocaleLowerCase()}`
          : `Agregar ${paymentType.toLocaleLowerCase()}`
      }
    >
      <Suspense fallback={<FormSkeleton />}>
        <PaymentForm payment={payment} paymentType={paymentType} />
      </Suspense>
    </Container>
  );
}
