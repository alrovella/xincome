"use client";
import { useAppUser } from "@/providers/user-provider";
import type { ExtendedAppointment } from "@/types/entities/appointment";
import { formatFriendlyDateTime } from "@/util/formatters";
import { formatPrice } from "@/util/utils";
import type { Customer } from "@repo/database";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import Link from "next/link";

const SendWhatsappDropdownMenu = ({
  customer,
  appointment,
}: {
  customer: Customer;
  appointment: ExtendedAppointment;
}) => {
  const { company } = useAppUser();
  const appointmentInfoMessage = encodeURIComponent(
    `Hola ${customer.name}!\n\n Te dejo los datos del turno que solicitaste: \n\nServicio: ${appointment.service.name} \nFecha y Hora: ${formatFriendlyDateTime(appointment.fromDatetime)} \nTotal a pagar: ${formatPrice(appointment.totalToPay)} \nLink del turno: ${process.env.NEXT_PUBLIC_BASE_URL}/web/${company.slug}/appointment/${appointment.id} \n\nLink de pago de reserva: ${process.env.NEXT_PUBLIC_BASE_URL}${company.slug}/appointment-payment/${appointment.id} \n\nConfirmame si los datos son correctos.\n\nSaludos!`
  );

  const appointmentDepositMessage = encodeURIComponent(
    `Hola ${customer.name}!\n\nRelacionado con el turno de ${appointment.service.name}  para el ${formatFriendlyDateTime(appointment.fromDatetime)},te dejo el link para realizar el pago de tu reserva: ${process.env.NEXT_PUBLIC_BASE_URL}${company.slug}/appointment-payment/${appointment.id} \n\nSaludos!`
  );

  const appointmentInfoMessageUrl = `https://wa.me/${customer.phoneNumber}?text=${appointmentInfoMessage}`;
  const appointmentDepositMessageUrl = `https://wa.me/${customer.phoneNumber}?text=${appointmentDepositMessage}`;
  const customMessageUrl = `https://wa.me/${customer.phoneNumber}`;

  return (
    <DropdownMenuGroup>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>Enviar Whatsapp</DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <Link href={customMessageUrl} target="_blank">
                Enviar mensaje
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={appointmentInfoMessageUrl} target="_blank">
                Enviar datos del turno
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={appointmentDepositMessageUrl} target="_blank">
                Enviar link de pago de reserva
              </Link>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  );
};

export default SendWhatsappDropdownMenu;
