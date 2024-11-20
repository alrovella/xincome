import { getCustomer } from "@/server/queries/customers";
import CustomerForm from "../../customers/_components/customers-form";
import { Container } from "@repo/ui/components/ui/container";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) {
  const { id } = await searchParams;
  const customer = await getCustomer(id);

  return (
    <Container title={`${customer ? "Editar" : "Nuevo"} Cliente`}>
      <CustomerForm customer={customer} />
    </Container>
  );
}
