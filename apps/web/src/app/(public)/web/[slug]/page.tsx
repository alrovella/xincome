import { getCompanyBySlug } from "@/server/queries/companies";
import NotFound from "./not-found";
import { CheckCircle, Clock, Coins, CreditCard } from "lucide-react";
import { getSchedulesForWeb } from "@/server/queries/schedules";
import { formatPrice } from "@/util/utils";

const CompanyPage = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;

  const { slug } = params;

  const company = await getCompanyBySlug(slug);
  if (!company) return <NotFound />;
  const schedules = await getSchedulesForWeb(company.id);
  return (
    <div>
      {company?.options?.webServicesVisibility === "NO_MOSTRAR" ? null : (
        <div className="mb-4">
          <div className="flex justify-start items-center gap-2 mb-4 font-bold text-2xl text-primary">
            <CheckCircle className="size-6" />
            <span>Nuestros Servicios</span>
          </div>
          <div>
            {schedules.map((schedule) => (
              <div className="gap-3 grid grid-cols-1" key={schedule.id}>
                {schedule.services.map((service) => (
                  <div key={service.id}>
                    <strong className="font-xl">{service.name}</strong>
                    {service.description && (
                      <div className="mt-2 mb-4">{service.description}</div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="size-3" />
                      <span>Duración:</span>
                      <span>{service.durationInMinutes}</span>
                      <span>minutos</span>
                    </div>
                    {company?.options?.webServicesVisibility ===
                    "SERVICIOS_CON_PRECIOS" ? (
                      <div className="flex items-center gap-1">
                        <Coins className="size-3" />
                        Precio: {formatPrice(service.price)}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {company.paymentMethods && company.paymentMethods.length > 0 ? (
        <div className="mb-4">
          <div className="flex justify-start items-center gap-2 mb-4 font-bold text-2xl text-primary">
            <CreditCard className="size-6" />
            <span>Métodos de pago</span>
          </div>
          <div>
            {company.paymentMethods.map((paymentMethod) => (
              <div key={paymentMethod.id}>{paymentMethod.name}</div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CompanyPage;
