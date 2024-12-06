"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Card } from "@repo/ui/components/ui/card";
import { useBankAccounts } from "@/hooks/queries/useBankAccounts";
import { getPeriods } from "@/util/static";
import { useCallback } from "react";

const ListFilters = ({ showStatusSelect }: { showStatusSelect?: boolean }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const { data: bankAccounts } = useBankAccounts();

  const handleCanceledSalesClick = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    if (params.get("isCancelled") === "true") {
      params.delete("isCancelled");
    } else {
      params.set("isCancelled", "true");
    }
    replace(`${pathname}?${params.toString()}`);
  }, [pathname, replace, searchParams]);

  const handleChangeBankAccount = useCallback(
    (e: string) => {
      const params = new URLSearchParams(searchParams);
      if (e === "-1") {
        params.delete("bankAccountId");
      } else {
        params.set("bankAccountId", e);
      }
      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, replace, searchParams]
  );

  const handleChangePeriod = useCallback(
    (e: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("period", e);
      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, replace, searchParams]
  );

  return (
    <Card className="flex md:flex-row flex-col justify-center md:justify-end items-center gap-2 bg-accent/20 my-4 p-2 rounded-sm">
      {showStatusSelect && (
        <Select
          value={searchParams.get("isCancelled") ?? "false"}
          onValueChange={() => handleCanceledSalesClick()}
        >
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder="Selecionar Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="false">Activas</SelectItem>
            <SelectItem value="true">Canceladas</SelectItem>
          </SelectContent>
        </Select>
      )}

      <Select
        value={searchParams.get("period") ?? "ESTEMES"}
        onValueChange={(e) => handleChangePeriod(String(e))}
      >
        <SelectTrigger className="w-full md:w-[250px]">
          <SelectValue placeholder="Selecionar Período" />
        </SelectTrigger>
        <SelectContent>
          {getPeriods().map((period) => (
            <SelectItem key={period.key} value={period.key.toString()}>
              {period.description}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        onValueChange={(e) => handleChangeBankAccount(e)}
        value={searchParams.get("bankAccountId") ?? "-1"}
      >
        <SelectTrigger className="w-full md:w-[250px]">
          <SelectValue placeholder="Cuenta Bancaria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="-1">Todas las cuentas bancarias</SelectItem>
          {bankAccounts?.map((item) => (
            <SelectItem key={item.id} value={item.id.toString()}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Card>
  );
};

export default ListFilters;
