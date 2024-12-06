import { Container } from "@repo/ui/components/ui/container";
import BankAccountList from "./_components/bank-account-list";
import PrimaryLink from "@/components/common/links/PrimaryLink";

export default async function Page() {
  return (
    <Container
      title="Cuentas Bancarias"
      headerChildren={
        <PrimaryLink href="/bank-accounts/edit">
          Nueva Cuenta Bancaria
        </PrimaryLink>
      }
    >
      <BankAccountList />
    </Container>
  );
}
