"use client";
import {
  BookIcon,
  BoxesIcon,
  CalendarDays,
  Globe,
  LifeBuoyIcon,
  Printer,
  Settings2Icon,
  Sparkles,
  UsersIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@repo/ui/components/ui/sidebar";
import Link from "next/link";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import Logo from "../logo";
import { useAppUser } from "@/providers/user-provider";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setOpenMobile, isMobile } = useSidebar();
  const { company } = useAppUser();
  const data = {
    navMain: [
      {
        title: "Administración",
        url: "#",
        icon: BookIcon,
        isActive: false,
        items: [
          {
            title: "Ventas",
            url: "/sales",
          },
          {
            title: "Compras",
            url: "/purchases",
          },
          {
            title: "Cobranzas",
            url: "/payments/COBRANZA",
          },
          {
            title: "Pagos",
            url: "/payments/PAGO",
          },
        ],
      },
      {
        title: "Productos",
        url: "#",
        icon: BoxesIcon,
        isActive: false,
        items: [
          {
            title: "Productos",
            url: "/products",
          },
          {
            title: "Categorías",
            url: "/product-categories",
          },
        ],
      },
      {
        title: "Personas",
        url: "#",
        icon: UsersIcon,
        isActive: false,
        items: [
          {
            title: "Clientes",
            url: "/customers",
          },
          {
            title: "Proveedores",
            url: "/suppliers",
          },
        ],
      },
      {
        title: "Turnos y Agendas",
        icon: CalendarDays,
        url: "#",
        isActive: false,
        isFirstSetup: false,
        items: [
          {
            title: "Turnos",
            url: "/appointments",
          },
          {
            title: "Agendas",
            url: "/schedules",
          },
        ],
      },
      {
        title: "Reportes",
        url: "#",
        icon: Printer,
        isActive: false,
        items: [
          {
            title: "Stock",
            url: "/reports/stock",
          },
          {
            title: "Resumen de Cuentas",
            url: "/reports/account-summary",
          },
          {
            title: "Turnos por servicio",
            url: "/reports/appointments-by-service",
          },
          {
            title: "Turnos por estado",
            url: "/reports/appointments-by-status",
          },
          {
            title: "Cobranzas por periodo",
            url: "/reports/appointment-payments",
          },
        ],
      },
      {
        title: "Configuración",
        url: "#",
        icon: Settings2Icon,
        isActive: false,
        items: [
          {
            title: "Servicios",
            url: "/services",
          },
          {
            title: "Talles",
            url: "/product-sizes",
          },
          {
            title: "Cuentas Bancarias",
            url: "/bank-accounts",
          },
          {
            title: "Metodos de Pago",
            url: "/payment-methods",
          },
          {
            title: "General",
            url: "/configuration",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Soporte",
        url: "/support",
        icon: LifeBuoyIcon,
      },
      {
        title: "Actualizar Plan",
        url: "/plans",
        icon: Sparkles,
      },
      {
        title: `Ir a ${company?.name}`,
        url: `/web/${company?.slug}`,
        icon: Globe,
      },
    ],
  };
  const handleClick = () => {
    isMobile && setOpenMobile(false);
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard" onClick={handleClick}>
                <Logo className="w-[50px]" />
                <div className="flex-1 grid text-left text-sm leading-tight">
                  <span className="font-semibold truncate">
                    {process.env.NEXT_PUBLIC_APP_NAME}
                  </span>
                  <span className="text-xs truncate">Admin+Stock+Turnos</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
