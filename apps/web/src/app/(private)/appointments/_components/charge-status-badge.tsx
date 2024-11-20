import type { ChargeStatus } from "@repo/database";
import { Badge } from "@repo/ui/components/ui/badge";

const ChargeStatusBadge = ({
  chargeStatus,
}: {
  chargeStatus: ChargeStatus;
}) => {
  return (
    <Badge
      className="flex justify-center items-center shadow-inner rounded-sm select-none"
      variant={
        chargeStatus === "COBRADO"
          ? "success"
          : chargeStatus === "COBRADO_PARCIALMENTE"
            ? "warning"
            : "destructive"
      }
    >
      {chargeStatus.replace("_", " ")}
    </Badge>
  );
};

export default ChargeStatusBadge;
