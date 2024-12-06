import {
  getPaymentMethods,
  getPaymentMethodsByCompany,
} from "@/server/queries/payment-methods";
import PaymentMethodsForm from "./_components/payment-methods-form";
import { Container } from "@repo/ui/components/ui/container";
import { Suspense } from "react";
import FormSkeleton from "@/components/common/skeletons/FormSkeleton";

export default async function ConfigurationPage() {
  const paymentmethods = await getPaymentMethods();
  const selectedPaymentMethods = await getPaymentMethodsByCompany();
  return (
    <Container title="Metodos de Pago">
      <Suspense fallback={<FormSkeleton />}>
        <PaymentMethodsForm
          defaultPaymentMethods={paymentmethods}
          selectedPaymentMethods={selectedPaymentMethods}
        />
      </Suspense>
    </Container>
  );
}
