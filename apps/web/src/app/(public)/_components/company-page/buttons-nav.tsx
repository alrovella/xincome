"use client";
import { CalendarPlus, Earth, Send } from "lucide-react";
import { Button, buttonVariants } from "@repo/ui/components/ui/button";
import Link from "next/link";
import { cn } from "@repo/ui/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import NewAppointmentForm from "@/app/(public)/_components/company-page/new-appointment-form";
import { useCompanyPublic } from "@/providers/CompanyPublicContextProvider";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@repo/ui/components/ui/drawer";

const ButtonsNav = () => {
  const company = useCompanyPublic();
  const customMessageUrl = `https://wa.me/${company.phone}?text=Hola!`;
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <>
      {company.whatsapp && (
        <Link
          className={cn(
            "flex items-center gap-1",
            buttonVariants({ variant: "outline", size: "sm" })
          )}
          href={customMessageUrl}
          target="_blank"
        >
          <Send className="size-4" />
          <span className="sm:flex hidden">Whatsapp</span>
        </Link>
      )}

      {company.facebook || company.instagram ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Earth className="size-4" />
              <span className="sm:flex hidden">Redes Sociales</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {company.facebook && (
              <DropdownMenuItem>
                <Link
                  href={company.facebook}
                  target="_blank"
                  className="w-full"
                >
                  Facebook
                </Link>
              </DropdownMenuItem>
            )}
            {company.instagram && (
              <DropdownMenuItem>
                <Link
                  href={company.instagram}
                  target="_blank"
                  className="w-full"
                >
                  Instagram
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
      {company.options?.webReservations &&
      company.schedules.filter((c) => c.active).length > 0 ? (
        <>
          {isDesktop ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-1">
                  <CalendarPlus className="size-4" />
                  <span className="sm:flex hidden">Reservar Turno</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gradient-to-b from-slate-50 to-slate-100 max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    Reservar Turno
                  </DialogTitle>
                </DialogHeader>
                <NewAppointmentForm />
              </DialogContent>
            </Dialog>
          ) : (
            <Drawer>
              <DrawerTrigger asChild>
                <Button size="sm" className="flex items-center gap-1">
                  <CalendarPlus className="size-4" />
                  <span className="sm:flex hidden">Reservar Turno</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="p-2">
                <DrawerHeader className="text-left">
                  <DrawerTitle>Reservar Turno</DrawerTitle>
                </DrawerHeader>
                <NewAppointmentForm />
                <DrawerFooter className="pt-2">
                  <DrawerClose asChild>
                    <Button variant="ghostNoHover">Cerrar</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          )}
        </>
      ) : null}
    </>
  );
};

export default ButtonsNav;
