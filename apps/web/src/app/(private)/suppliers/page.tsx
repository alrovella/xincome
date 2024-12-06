import { Container } from "@repo/ui/components/ui/container";
import SupplierList from "./_components/suppliers-list";
import PrimaryLink from "@/components/common/links/PrimaryLink";

export default async function Page() {
  return (
    <Container
      title="Proveedores"
      headerChildren={
        <PrimaryLink href="/suppliers/edit">Nuevo Proveedor</PrimaryLink>
      }
    >
      <SupplierList />
    </Container>
  );
}
