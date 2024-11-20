"use client";
import { useSuppliers } from "@/hooks/queries/useSuppliers";
import { usePurchaseStore } from "@/hooks/stores/usePurchaseStore";
import { Label } from "@repo/ui/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { useEffect } from "react";

const PurchaseSupplierSelect = () => {
  const { supplierId, setSupplierId } = usePurchaseStore();
  const { data: suppliers, isLoading: isLoadingSuppliers } = useSuppliers();

  const handleChange = (e: string) => {
    setSupplierId(e);
  };

  useEffect(() => {
    const id = suppliers?.at(0)?.id;
    if (id && !supplierId) setSupplierId(id);
  }, [suppliers, supplierId, setSupplierId]);

  return (
    <div className="flex flex-col gap-2 mb-2">
      <Label htmlFor="supplierId">Filtrar por Proveedor</Label>
      <Select
        name="supplierId"
        disabled={suppliers?.length === 0 || isLoadingSuppliers}
        value={supplierId?.toString()}
        onValueChange={handleChange}
      >
        <SelectTrigger className="w-full md:w-2/4">
          <SelectValue placeholder="Seleccionar Proveedor" />
        </SelectTrigger>
        <SelectContent>
          {suppliers?.map((item) => (
            <SelectItem key={item.id} value={item.id.toString()}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PurchaseSupplierSelect;
