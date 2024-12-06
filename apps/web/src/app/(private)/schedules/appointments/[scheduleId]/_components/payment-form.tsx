"use client";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { usePayments } from "@/hooks/queries/usePayments";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { formatDate } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/components/ui/alert-dialog";
import { cn } from "@repo/ui/lib/utils";
import { useEffect, useState, useTransition } from "react";
import {
  cancelAppointment,
  confirmAppointment,
} from "@/server/actions/appointments";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { X } from "lucide-react";
import { useAppointment } from "@/hooks/queries/useAppointments";
import { paymentFormSchema } from "@/schemas/forms/payment-form-schema";
import ListSkeleton from "@/components/common/skeletons/ListSkeleton";
import { formatPrice } from "@/util/utils";
import { AppointmentCard } from "@/app/(private)/appointments/_components/appointment-card";
import { addPayment, cancelPayment } from "@/server/actions/payments";
import { useBankAccounts } from "@/hooks/queries/useBankAccounts";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@repo/ui/components/ui/select";
import FormErrorsAlert from "@/components/common/forms/FormErrorsAlert";

const PaymentForm = ({ appointmentId }: { appointmentId: string }) => {
  const {
    data: appointment,
    refetch: refetchAppointment,
    isLoading: isLoadingAppointment,
  } = useAppointment({
    appointmentId,
  });

  const {
    data: payments,
    refetch: refetchPayments,
    isLoading: isLoadingPayments,
  } = usePayments({
    appointmentId,
    page: 1,
    limit: 10000,
    isCancelled: false,
    paymentType: "COBRANZA",
  });

  const router = useRouter();
  const [isCancellingPayment, startPaymentCancellationTransition] =
    useTransition();
  const [totalPayments, setTotalPayments] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [savePaymentTimes, setSavePaymentTimes] = useState(0);

  const { data: bankAccounts, isLoading: isLoadingBankAccounts } =
    useBankAccounts();

  const [isCancelling, startCancellationTransition] = useTransition();
  const [isConfirming, startConfirmationTransition] = useTransition();

  const onConfirmAppointment = (appointmentId: string) => {
    startConfirmationTransition(async () => {
      if (!appointmentId) return;

      const data = await confirmAppointment(appointmentId);
      if (data?.error) {
        toast.error(data?.message);
      } else {
        toast.success(data?.message);
        refetchAppointment();
      }
    });
  };

  const onCancelAppointment = (appointmentId: string) => {
    startCancellationTransition(async () => {
      if (!appointmentId) return;

      const data = await cancelAppointment(appointmentId, "");
      if (data?.error) {
        toast.error(data?.message);
      } else {
        toast.success(data?.message);
        refetchAppointment();
      }
    });
  };

  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      createdAt: new Date(),
      type: "COBRANZA",
      title: `Cobranza de turno ${appointmentId}`,
      appointmentId,
      amount: 0,
      comments: "",
    },
  });

  async function onSubmit(values: z.infer<typeof paymentFormSchema>) {
    const data = await addPayment(values);

    if (data?.error) {
      form.setError("root", {
        message: data?.message,
      });
    } else {
      toast.success(data?.message);

      setSavePaymentTimes((prev) => prev + 1);

      refetchPayments();
      refetchAppointment();
    }
  }

  useEffect(() => {
    const show =
      savePaymentTimes > 0 &&
      totalPayments > 0 &&
      appointment?.status === "NO_CONFIRMADO";

    setShowConfirmDialog(show);
  }, [totalPayments, savePaymentTimes, appointment?.status]);

  const handleCancelPayment = async (paymentId: string) => {
    startPaymentCancellationTransition(async () => {
      const data = await cancelPayment(paymentId);
      if (data?.error) {
        toast.error(data?.message);
      } else {
        toast.success(data?.message);
        refetchPayments();
        refetchAppointment();
      }
    });
  };

  useEffect(() => {
    if (payments) {
      setTotalPayments(
        payments
          .filter((c) => !c.isCancelled)
          .reduce((sum, payment) => sum + payment.amount, 0)
      );
    }
  }, [payments]);

  return (
    <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {isLoadingAppointment && (
        <Card className="card">
          <CardContent className="max-h-68">
            <ListSkeleton />
          </CardContent>
        </Card>
      )}
      {appointment && (
        <AppointmentCard
          appointment={appointment}
          onConfirm={() => onConfirmAppointment(appointment.id)}
          isConfirming={isConfirming}
          onCancel={onCancelAppointment}
          isCancelling={isCancelling}
          showOptions={{
            sendWhatsapp: true,
            editAppointment: true,
            cancelAppointment: true,
            confirmAppointment: true,
            customerInfo: true,
            lastsCustomerAppointments: true,
          }}
        />
      )}
      <Card className="card">
        <CardHeader className="card-header">
          <CardTitle className="flex justify-between items-center text-lg">
            <div>Cobranzas Realizadas</div>
          </CardTitle>
        </CardHeader>
        {isLoadingPayments && <ListSkeleton />}
        <CardContent className="p-0 max-h-68 overflow-auto scrollbar">
          {payments?.length === 0 && (
            <div className="mt-4 p-4 text-muted-foreground text-sm">
              No hay cobranzas para este turno
            </div>
          )}
          {payments && payments?.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="w-1/2">Título</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead className="text-right"> </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments?.map((payment) => (
                  <TableRow key={payment.id} className="border">
                    <TableCell>
                      {formatDate(payment.createdAt, "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell title={payment?.title ?? ""}>
                      <span className="line-clamp-1">{payment.title}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(payment.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructiveOutline"
                            size="xs"
                            disabled={isCancellingPayment || isLoadingPayments}
                          >
                            <X className="size-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancelar cobro</AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogDescription>
                            ¿Estas seguro de que quieres cancelar este cobro?
                          </AlertDialogDescription>
                          <AlertDialogFooter>
                            <AlertDialogCancel>No cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleCancelPayment(payment.id)}
                            >
                              Si, cancelar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter
          className={cn("card-footer flex items-center justify-around")}
        >
          {!isLoadingPayments && (
            <>
              <div className="text-sm">
                <div>A COBRAR:</div>
                <div>{formatPrice(appointment?.totalToPay ?? 0)}</div>
              </div>
              <div className="text-sm">
                <div>COBRADO:</div>
                <div>{formatPrice(totalPayments)}</div>
              </div>
              {appointment && (
                <div className="text-sm">
                  <div>RESTANTE:</div>
                  <div>
                    {formatPrice(appointment?.totalToPay - totalPayments)}
                  </div>
                </div>
              )}
            </>
          )}
        </CardFooter>
      </Card>
      <Form {...form}>
        <form
          className="flex flex-col gap-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Card className="card">
            <CardHeader className="card-header">
              <CardTitle className="text-lg">Nuevo Cobro</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <FormField
                control={form.control}
                name="bankAccountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuenta Bancaria</FormLabel>
                    <FormControl>
                      <Select
                        disabled={isLoadingBankAccounts}
                        value={field.value ? String(field.value) : undefined}
                        onValueChange={(e) => {
                          field.onChange(e);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecionar Cuenta Bancaria" />
                        </SelectTrigger>
                        <SelectContent>
                          {bankAccounts?.map((item) => (
                            <SelectItem
                              key={item.id}
                              value={item.id.toString()}
                            >
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Importe</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        disabled={
                          form.formState.isSubmitting ||
                          totalPayments === appointment?.totalToPay
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comentarios</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="h-32 resize-none"
                        disabled={
                          form.formState.isSubmitting ||
                          totalPayments === appointment?.totalToPay
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className={cn("card-footer", "flex justify-end gap-2")}>
              <Button
                variant="outline"
                type="button"
                disabled={form.formState.isSubmitting}
                onClick={() => router.back()}
              >
                Volver
              </Button>
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting ||
                  totalPayments === appointment?.totalToPay
                }
              >
                Guardar
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      <FormErrorsAlert message={form.formState.errors.root?.message} />

      {appointment && (
        <AlertDialog open={showConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar turno</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              Deseas dejar confirmado el turno?
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setShowConfirmDialog(false);
                }}
              >
                No, gracias
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  const data = await confirmAppointment(appointment.id);
                  if (data?.error) {
                    toast.error(
                      "Hubo un error al querer carncelar el turno. Intenta nuevamente"
                    );
                  } else {
                    toast.success(data?.message);
                    router.back();
                  }
                }}
              >
                Si, confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default PaymentForm;
