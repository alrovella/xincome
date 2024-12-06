"use client";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@repo/ui/components/ui/form";
import { Button } from "@repo/ui/components/ui/button";
import { useRouter } from "next/navigation";
import { Switch } from "@repo/ui/components/ui/switch";
import type { CompanyPaymentMethod, PaymentMethod } from "@repo/database";
import { Label } from "@repo/ui/components/ui/label";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useAppUser } from "@/providers/UserContextProvider";
import {
  type PaymentMethodForForms,
  paymentMethodSchema,
} from "@/schemas/forms/payment-method-form-schema";
import { updatePaymentMethods } from "@/server/actions/payment-methods";
import FormFooter from "@/components/common/forms/FormFooter";
import FormErrorsAlert from "@/components/common/forms/FormErrorsAlert";

const PaymentMethodsForm = ({
  defaultPaymentMethods,
  selectedPaymentMethods,
}: {
  defaultPaymentMethods: PaymentMethod[];
  selectedPaymentMethods: CompanyPaymentMethod[];
}) => {
  const { company } = useAppUser();

  const router = useRouter();

  const form = useForm<PaymentMethodForForms>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      paymentMethods: selectedPaymentMethods || [],
    },
  });

  const {
    fields: paymentMethodFields,
    append,
    remove,
  } = useFieldArray({
    name: "paymentMethods",
    control: form.control,
  });

  const handleRemovePaymentMethod = useCallback(
    (id: string) => {
      const index = paymentMethodFields.findIndex(
        (field) => field.paymentMethodId === id
      );
      if (index !== -1) remove(index);
    },
    [paymentMethodFields, remove]
  );

  const handleAddPaymentMethod = useCallback(
    (id: string) => {
      append({
        paymentMethodId: id,
        companyId: company.id,
      });
    },
    [append, company.id]
  );

  async function onSubmit(values: PaymentMethodForForms) {
    toast.loading("Guardando metodos de pago...");

    const data = await updatePaymentMethods(values);

    toast.dismiss();

    if (data?.error) {
      form.setError("root", {
        message:
          data?.message ??
          "Hubo un error al querer guardar el metodo de pago. Intenta nuevamente",
      });
    } else {
      toast.success(data.message);
      router.push("/dashboard");
    }
  }

  return (
    <Form {...form}>
      <form
        className="space-y-4 sm:space-y-8 sm:p-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          {defaultPaymentMethods.map((paymentMethod) => (
            <div key={paymentMethod.id} className="flex items-center gap-2">
              <Label className="flex items-center gap-2">
                <Switch
                  checked={
                    paymentMethodFields.filter(
                      (field) => field.paymentMethodId === paymentMethod.id
                    ).length > 0
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleAddPaymentMethod(paymentMethod.id);
                    } else {
                      handleRemovePaymentMethod(paymentMethod.id);
                    }
                  }}
                />
                {paymentMethod.name}
              </Label>
            </div>
          ))}
        </div>

        <FormErrorsAlert message={form.formState.errors.root?.message} />

        <FormFooter className="flex justify-end items-center">
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              disabled={form.formState.isSubmitting}
              onClick={() => router.back()}
            >
              Volver
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Guardar
            </Button>
          </div>
        </FormFooter>
      </form>
    </Form>
  );
};

export default PaymentMethodsForm;
