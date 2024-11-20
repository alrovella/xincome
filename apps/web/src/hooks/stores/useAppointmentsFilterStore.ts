import type { AppointmentsFilterStore } from "@/types/stores/AppointmentsFilterStore";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useAppointmentsFilterStore = create(
  persist<AppointmentsFilterStore>(
    (set) => ({
      scheduleId: undefined,
      chargeStatus: undefined,
      customerName: undefined,
      status: undefined,
      period: "SEMANA",
      setStatus: (status) => set({ status }),
      setPeriod: (period) => set({ period }),
      setCustomerName: (customerName) => set({ customerName }),
      setChargeStatus: (chargeStatus) => set({ chargeStatus }),
      setScheduleId: (scheduleId) => set({ scheduleId }),
    }),
    {
      name: "appointmentsFilterStore-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
