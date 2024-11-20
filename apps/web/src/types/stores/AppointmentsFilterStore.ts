/* eslint-disable no-unused-vars */

import type { AppointmentStatus, ChargeStatus } from "@repo/database";
import type { AppointmentPeriodFilter } from "../entities/appointment";

export type AppointmentsFilterStore = {
  customerName?: string;
  status?: AppointmentStatus;
  period: (typeof AppointmentPeriodFilter)[number];
  chargeStatus?: ChargeStatus;
  scheduleId?: string;

  setStatus: (status?: AppointmentStatus) => void;
  setPeriod: (period: (typeof AppointmentPeriodFilter)[number]) => void;
  setCustomerName: (customerName?: string) => void;
  setChargeStatus: (chargeStatus?: ChargeStatus) => void;
  setScheduleId: (scheduleId?: string) => void;
};
