import type { Company } from "@repo/database";
import { MapPin } from "lucide-react";

const AddressInfo = ({ company }: { company: Company }) => {
  return (
    <ul>
      <li className="flex items-center gap-2">
        {company.address}, {company.city}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${company.address},${company.city}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center text-accent-foreground text-sm"
        >
          <MapPin className="size-4" /> Ver en el mapa
        </a>
      </li>
    </ul>
  );
};

export default AddressInfo;
