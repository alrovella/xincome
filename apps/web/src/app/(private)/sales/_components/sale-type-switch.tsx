"use client";

import { useSaleStore } from "@/hooks/stores/useSaleStore";
import { Switch } from "@repo/ui/components/ui/switch";

const SaleTypeSwitch = () => {
  const { saleType, setSaleType, items } = useSaleStore();

  return (
    <div className="flex flex-wrap justify-end items-center gap-1 text-sm">
      Normal
      <Switch
        disabled={items.length > 0}
        checked={saleType === "reseller"}
        onCheckedChange={() =>
          setSaleType(saleType === "normal" ? "reseller" : "normal")
        }
      />
      Reventa
    </div>
  );
};

export default SaleTypeSwitch;
