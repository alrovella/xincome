import { Container } from "@repo/ui/components/ui/container";
import PaymentsList from "../_components/payments-list";
import { getPluralPaymentType } from "@/util/utils";
import { PaymentType } from "@repo/database";
import PrimaryLink from "@/components/common/links/primary-link";

export default async function Page({
  params,
}: {
  params: Promise<{ paymentType: PaymentType }>;
}) {
  const { paymentType } = await params;
  return (
    <Container
      title={getPluralPaymentType(paymentType)}
      headerChildren={
        <PrimaryLink href={`/payments/${paymentType}/edit`}>
          Agregar {paymentType.toLocaleLowerCase()}
        </PrimaryLink>
      }
    >
      <PaymentsList paymentType={paymentType} />
    </Container>
  );
}
