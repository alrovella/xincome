"use client";
import { CalendarDays, ListFilter } from "lucide-react";
import { useAppointments } from "@/hooks/queries/useAppointments";
// import { useSidebar } from "@repo/ui/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@repo/ui/components/ui/card";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { useState, useTransition } from "react";
import {
  cancelAppointment,
  confirmAppointment,
} from "@/server/actions/appointments";
import toast from "react-hot-toast";
import { AppointmentCard } from "./appointment-card";
import AppointmentFilter from "./appointment-filter";
import { Button } from "@repo/ui/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerClose,
} from "@repo/ui/components/ui/drawer";
import EmptyStateAlert from "@/components/common/empty-state-alert";

const NO_APPOINTMENTS = "No hay turnos de acuerdo a tu búsqueda";
const NO_APPOINTMENTS_INSTRUCTIONS =
  "Cambiá los filtros de búsqueda y volvé a intentarlo";

const AppointmentList = () => {
  const {
    data: dataAppointments,
    isLoading: loadingAppointments,
    refetch: refecthAppointments,
    isRefetching: refetchingAppointments,
  } = useAppointments();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isCancelling, startCancellationTransition] = useTransition();
  const [isConfirming, startConfirmationTransition] = useTransition();

  const onConfirmAppointment = (appointmentId: string) => {
    startConfirmationTransition(async () => {
      if (!appointmentId) return;

      const data = await confirmAppointment(appointmentId);
      if (data?.error) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
        refecthAppointments();
      }
    });
  };

  const onCancelAppointment = (appointmentId: string) => {
    startCancellationTransition(async () => {
      if (!appointmentId) return;

      const data = await cancelAppointment(appointmentId, "");
      if (data?.error) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
        refecthAppointments();
      }
    });
  };

  return (
    <>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <DrawerTrigger className="flex items-end lg:hidden my-2 mr-2" asChild>
          <Button
            variant="outline"
            onClick={() => setDrawerOpen(true)}
            className="flex justify-end items-center gap-1"
          >
            Filtrar <ListFilter className="size-3" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-md">
            <div className="p-0.5 pt-4">
              <AppointmentFilter
                onNavigate={() => {
                  setDrawerOpen(false);
                }}
              />
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cerrar</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      <div className="gap-4 grid grid-cols-1 md:grid-cols-12">
        <div className="lg:block hidden lg:col-span-2">
          <AppointmentFilter />
        </div>
        <div className="col-span-12 lg:col-span-10">
          {loadingAppointments || refetchingAppointments ? (
            <div className="gap-2 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
              <AppointmentListSkeleton />
            </div>
          ) : (
            <>
              {dataAppointments?.length === 0 && <NoAppointmentsCard />}
              <div className="gap-2 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
                {dataAppointments?.map((appointment) => (
                  <AppointmentCard
                    onConfirm={() => onConfirmAppointment(appointment.id)}
                    isConfirming={isConfirming}
                    onCancel={onCancelAppointment}
                    isCancelling={isCancelling}
                    appointment={appointment}
                    key={appointment.id}
                    showOptions={{
                      addToGoogleCalendar: true,
                      sendWhatsapp: true,
                      editAppointment: true,
                      cancelAppointment: true,
                      confirmAppointment: true,
                      customerInfo: true,
                      lastsCustomerAppointments: true,
                      appointmentPayments: true,
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AppointmentList;

const NoAppointmentsCard = () => {
  return (
    <EmptyStateAlert className="flex flex-col justify-center gap-4 item-center">
      <CalendarDays className="size-12" />
      <h2 className="font-bold text-balance text-center text-xl">
        {NO_APPOINTMENTS}
      </h2>
      <div className="text-balance text-center">
        {NO_APPOINTMENTS_INSTRUCTIONS}
      </div>
    </EmptyStateAlert>
  );
};

const AppointmentListSkeleton = () => {
  const totalCards = 6;

  return (
    <>
      {[...Array(totalCards)].map((_, i) => (
        <Card
          className="border-accent shadow-md h-80"
          key={`skeleton-card-${
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            i
          }`}
        >
          <CardHeader>
            <Skeleton className="rounded-xl w-full h-12" />
          </CardHeader>
          <CardContent className="flex flex-row gap-2 py-2">
            <div className="flex flex-col gap-2">
              <Skeleton className="w-[350px] h-4" />
              <Skeleton className="w-[300px] h-4" />
              <Skeleton className="w-[250px] h-4" />
              <Skeleton className="w-[200px] h-4" />
              <Skeleton className="w-[200px] h-4" />
              <Skeleton className="w-[200px] h-4" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="rounded-xl w-full h-12" />
          </CardFooter>
        </Card>
      ))}
    </>
  );
};
