"use client";
import { useSchedules } from "@/hooks/queries/useSchedule";
import { useAppointmentsFilterStore } from "@/hooks/stores/useAppointmentsFilterStore";
import {
  appointmentStatuses,
  getAppointmentPeriodFilters,
} from "@/types/entities/appointment";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@repo/ui/components/ui/select";
import { cn } from "@repo/ui/lib/utils";
import { CalendarCogIcon, ChevronRight, CogIcon, Coins, X } from "lucide-react";
import { useEffect, useState } from "react";

const AppointmentFilter = ({ onNavigate }: { onNavigate?: () => void }) => {
  const {
    scheduleId,
    status,
    period,
    chargeStatus,
    customerName,
    setScheduleId,
    setChargeStatus,
    setStatus,
    setPeriod,
    setCustomerName,
  } = useAppointmentsFilterStore();

  const { data: schedules } = useSchedules();
  const [localCustomerName, setLocalCustomerName] = useState("");

  const handleClearInput = () => {
    setCustomerName("");
    setLocalCustomerName("");
    onNavigate?.();
  };

  const handleSearchName = () => {
    setCustomerName(localCustomerName);
    onNavigate?.();
  };

  useEffect(() => {
    if (customerName) {
      setLocalCustomerName(customerName);
    }
  }, [customerName]);

  return (
    <Card
      className={cn(
        "h-full overflow-hidden",
        onNavigate && "border-none shadow-none"
      )}
    >
      <CardContent
        className={cn("flex flex-col gap-4 p-2", onNavigate && "p-0")}
      >
        {schedules && schedules?.length > 1 && (
          <>
            <Select
              onValueChange={(scheduleId) => {
                setScheduleId(scheduleId === "TODAS" ? undefined : scheduleId);
                onNavigate?.();
              }}
              value={scheduleId ?? "TODAS"}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="TODAS">Todas las agendas</SelectItem>
                  {schedules?.map((schedule) => (
                    <SelectItem key={schedule.id} value={schedule.id}>
                      {schedule.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <hr />
          </>
        )}
        <div className="flex items-center gap-2">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Buscar Cliente..."
              value={localCustomerName ?? ""}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchName();
                }
              }}
              onChange={(e) => {
                setLocalCustomerName(e.target.value);
              }}
              className="pr-10"
            />
            {localCustomerName && (
              <Button
                type="button"
                variant="link"
                size="icon"
                className="top-0 right-0 absolute h-full"
                onClick={handleClearInput}
              >
                <X className="w-4 h-4" />
                <span className="sr-only">Limpiar input</span>
              </Button>
            )}
          </div>
          <Button variant="secondary" onClick={() => handleSearchName()}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <hr />
        <div>
          <Label className="flex items-center gap-1 mb-2 pl-4 font-semibold">
            <CogIcon className="size-4" />
            <span>Filtrar por estado</span>
          </Label>

          <div className={cn("grid grid-cols-1", onNavigate && "grid-cols-2")}>
            <Button
              variant={status === undefined ? "secondary" : "ghost"}
              size={onNavigate ? "xs" : "default"}
              onClick={() => {
                setStatus(undefined);
                onNavigate?.();
              }}
              className={cn("justify-start w-full text-sm", {
                "font-bold text-accent-foreground": status === undefined,
              })}
            >
              TODOS
            </Button>
            {appointmentStatuses.map((appointmentStatus) => (
              <Button
                variant={appointmentStatus === status ? "secondary" : "ghost"}
                size={onNavigate ? "xs" : "default"}
                key={appointmentStatus}
                onClick={() => {
                  setStatus(appointmentStatus);
                  onNavigate?.();
                }}
                className={cn("justify-start w-full", {
                  "font-bold text-accent-foreground":
                    appointmentStatus === status,
                })}
              >
                {appointmentStatus.replace("_", " ")}
              </Button>
            ))}
          </div>
        </div>
        <hr />
        <div>
          <Label className="flex items-center gap-1 mb-2 pl-4 font-semibold">
            <Coins className="size-4" />
            <span>Filtrar por Cobro </span>
          </Label>
          <div
            className={cn(
              "justify-start items-center gap-1 grid grid-cols-1 w-full",
              onNavigate && "grid-cols-2"
            )}
          >
            <Button
              variant={chargeStatus === undefined ? "secondary" : "ghost"}
              size={onNavigate ? "xs" : "default"}
              onClick={() => {
                setChargeStatus(undefined);
                onNavigate?.();
              }}
              className={cn("justify-start w-full", {
                "font-bold text-accent-foreground": chargeStatus === undefined,
              })}
            >
              TODOS
            </Button>
            <Button
              variant={
                chargeStatus === "COBRADO_PARCIALMENTE" ? "secondary" : "ghost"
              }
              size={onNavigate ? "xs" : "default"}
              onClick={() => {
                setChargeStatus("COBRADO_PARCIALMENTE");
                onNavigate?.();
              }}
              className={cn("justify-start w-full", {
                "font-bold text-accent-foreground":
                  chargeStatus === "COBRADO_PARCIALMENTE",
              })}
            >
              COBRADO PARCIALMENTE
            </Button>
            <Button
              variant={chargeStatus === "COBRADO" ? "secondary" : "ghost"}
              size={onNavigate ? "xs" : "default"}
              onClick={() => {
                setChargeStatus("COBRADO");
                onNavigate?.();
              }}
              className={cn("justify-start w-full", {
                "font-bold text-accent-foreground": chargeStatus === "COBRADO",
              })}
            >
              COBRADO
            </Button>
            <Button
              variant={chargeStatus === "NO_COBRADO" ? "secondary" : "ghost"}
              size={onNavigate ? "xs" : "default"}
              onClick={() => {
                setChargeStatus("NO_COBRADO");
                onNavigate?.();
              }}
              className={cn("justify-start w-full", {
                "font-bold text-accent-foreground":
                  chargeStatus === "NO_COBRADO",
              })}
            >
              NO COBRADO
            </Button>
          </div>
        </div>
        <hr />
        <div>
          <Label className="flex items-center gap-1 mb-2 pl-4 font-semibold">
            <CalendarCogIcon className="size-4" />
            <span>Filtrar por Período</span>
          </Label>
          <div
            className={cn(
              "justify-start items-center gap-1 grid grid-cols-1 w-full",
              onNavigate && "grid-cols-2"
            )}
          >
            {getAppointmentPeriodFilters().map((appointmentPeriod) => (
              <Button
                variant={
                  appointmentPeriod.key === period ? "secondary" : "ghost"
                }
                size={onNavigate ? "xs" : "default"}
                key={appointmentPeriod.key}
                onClick={() => {
                  setPeriod(appointmentPeriod.key);
                  onNavigate?.();
                }}
                className={cn("justify-start w-full", {
                  "font-bold text-accent-foreground":
                    appointmentPeriod.key === period,
                })}
              >
                {appointmentPeriod.description.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default AppointmentFilter;
