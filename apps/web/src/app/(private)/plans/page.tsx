import Plans from "./_components/plans";
import { Suspense } from "react";
import { Container } from "@repo/ui/components/ui/container";
import CardsSkeleton from "@/components/common/skeletons/cards-skeleton";

const Page = async () => {
  return (
    <Container title="Actualizar Plan">
      <Suspense fallback={<CardsSkeleton />}>
        <Plans />
      </Suspense>
    </Container>
  );
};

export default Page;
