import { getBankAccount } from "@/server/queries/bank-accounts";
import BankAccountForm from "../_components/bank-account-form";
import { Container } from "@repo/ui/components/ui/container";
import { Suspense } from "react";
import FormSkeleton from "@/components/common/skeletons/form-skeleton";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id: number }>;
}) {
  const { id } = await searchParams;
  const bankAccount = await getBankAccount(id);

  return (
    <Container title={`${bankAccount ? "Editar" : "Nueva"} Cuenta Bancaria`}>
      <Suspense fallback={<FormSkeleton />}>
        <BankAccountForm bankAccount={bankAccount} />
      </Suspense>
    </Container>
  );
}
