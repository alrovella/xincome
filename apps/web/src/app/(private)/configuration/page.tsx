import { Container } from "@repo/ui/components/ui/container";
import ConfigurationForm from "./_components/configuration-form";
import { Suspense } from "react";
import FormSkeleton from "@/components/common/skeletons/FormSkeleton";
import { getLoggedInCompany } from "@/server/queries/companies";
import { notFound } from "next/navigation";

export default async function Page() {
  const company = await getLoggedInCompany();
  if (!company) return notFound();
  return (
    <Container title="Configuración General">
      <Suspense fallback={<FormSkeleton />}>
        <ConfigurationForm company={company} />
      </Suspense>
    </Container>
  );
}
