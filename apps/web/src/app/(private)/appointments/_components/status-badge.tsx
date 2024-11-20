import { bagdeVariant } from "@/util/bagdeVariant";
import type { AppointmentStatus } from "@repo/database";
import { Badge } from "@repo/ui/components/ui/badge";

const StatusBadge = ({ status }: { status: AppointmentStatus }) => {
  return (
    <Badge
      className="flex justify-center items-center shadow-inner rounded-sm select-none"
      variant={bagdeVariant(status)}
    >
      {status.replace("_", " ")}
    </Badge>
  );
};

export default StatusBadge;
