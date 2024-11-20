import type { CustomersFilterStore } from "@/types/stores/CustomersFilterStore";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useCustomersFilterStore = create(
  persist<CustomersFilterStore>(
    (set) => ({
      serviceId: "",
      setServiceId: (serviceId) => set({ serviceId }),
    }),
    {
      name: "CustomersFilterStore-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
