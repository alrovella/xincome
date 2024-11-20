"use client";

import { AlertCircle } from "lucide-react";
import UpgradePlanLink from "@/components/common/upgrade-plan-link";
import { useAppUser } from "@/providers/user-provider";
import PrimaryLink from "@/components/common/links/primary-link";

const AddScheduleButton = () => {
  const { company } = useAppUser();
  const disabled =
    company.schedules.length === company.companyPlan?.maxSchedules;

  return (
    <>
      {disabled ? (
        <div className="flex items-center gap-1">
          <div className="md:flex items-center gap-1 hidden text-destructive text-sm">
            <AlertCircle className="size-4" />
            Has alcanzado el limite de agendas
          </div>
          <UpgradePlanLink />
        </div>
      ) : (
        <PrimaryLink href="/schedules/new">Nueva Agenda</PrimaryLink>
      )}
    </>
  );
};

export default AddScheduleButton;
