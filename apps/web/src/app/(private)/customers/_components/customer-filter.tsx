"use client";
import { useCustomersFilterStore } from "@/hooks/stores/useCustomersFilterStore";
import type { Service } from "@repo/database";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";

const CustomerFilter = ({ services }: { services: Service[] }) => {
  const { serviceId, setServiceId } = useCustomersFilterStore();

  return (
    <Select
      value={serviceId}
      onValueChange={(e) => {
        if (e === "TODOS") {
          setServiceId("");
        } else {
          setServiceId(e);
        }
      }}
    >
      <SelectTrigger className="my-4">
        <SelectValue placeholder="Todos los servicios" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="TODOS">Todos los servicios</SelectItem>
          {services.map((service) => (
            <SelectItem key={service.id} value={String(service.id)}>
              {service.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CustomerFilter;
