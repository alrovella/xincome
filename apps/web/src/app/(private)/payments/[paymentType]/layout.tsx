import { getPluralPaymentType } from "@/util/utils";
import { PaymentType } from "@repo/database";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ paymentType: PaymentType }>;
}) => {
  const { paymentType } = await params;
  return {
    title: `${getPluralPaymentType(paymentType)} | ${process.env.NEXT_PUBLIC_APP_NAME}`,
    description: `Administración de ${getPluralPaymentType(paymentType)}`,
  };
};

const PaymentsLayout = async ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default PaymentsLayout;
