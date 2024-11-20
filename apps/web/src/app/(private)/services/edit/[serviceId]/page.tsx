import { getServiceById } from "@/server/queries/services";
import NotFound from "../not-found";
import ServiceForm from "../../_components/service-form";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;

  const service = await getServiceById(serviceId);
  if (!service) return NotFound();

  return <ServiceForm service={service} />;
}
