"use client";

import { subscribeToPlan } from "@/server/actions/mercadopago";
import { Button } from "@repo/ui/components/ui/button";
import { type SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import type { CompanyPlanFormData } from "@/types/entities/companyPlans";
const PlanForm = ({
  companyPlanId,
  disabled,
  bestSeller,
}: {
  companyPlanId: string;
  disabled?: boolean;
  bestSeller?: boolean;
}) => {
  const [redirecting, setRedirecting] = useState(false);

  const { register, handleSubmit, formState } = useForm<CompanyPlanFormData>({
    defaultValues: {
      companyPlanId,
    },
  });

  const onSubmit: SubmitHandler<CompanyPlanFormData> = async (data) => {
    const result = await subscribeToPlan(data);
    if (result.error) {
      toast.error(result.error);
    }

    if (result.init_point) {
      setRedirecting(true);
      window.location.href = result.init_point;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("companyPlanId")} />
      <Button
        variant={bestSeller ? "default" : "outline"}
        disabled={disabled || formState?.isSubmitting || redirecting}
        className="flex items-center gap-1"
        type="submit"
      >
        {redirecting || formState?.isSubmitting ? (
          <LoaderCircle className="animate-spin" />
        ) : null}
        Subscribirme
      </Button>
    </form>
  );
};

export default PlanForm;
