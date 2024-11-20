import type { AppointmentStatus } from "@repo/database";

export const bagdeVariant = (status: AppointmentStatus) => {
  switch (status) {
    case "NO_CONFIRMADO":
      return "outline";
    case "CONFIRMADO":
      return "success";
    case "CANCELADO":
      return "destructive";
    default:
      return "outline";
  }
};
