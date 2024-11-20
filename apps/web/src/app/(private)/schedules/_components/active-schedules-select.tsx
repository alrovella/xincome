"use client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@repo/ui/components/ui/select";
import { Label } from "@repo/ui/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Schedule } from "@repo/database";

const ActiveSchedulesSelect = ({ schedules }: { schedules: Schedule[] }) => {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  return (
    <Label className="flex items-center gap-1">
      <span className="md:flex hidden">Agendas Activas:</span>
      <Select
        disabled={redirecting}
        onValueChange={(e) => {
          setRedirecting(true);
          router.push(`/schedules/edit/${e}`);
        }}
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Seleccioná una agenda" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {schedules.map((schedule) => (
              <SelectItem key={schedule.id} value={schedule.id}>
                {schedule.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Label>
  );
};

export default ActiveSchedulesSelect;
