"use client";
import { ChevronsUpDown, User } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@repo/ui/components/ui/sidebar";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { Button } from "@repo/ui/components/ui/button";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

export function NavUser() {
  const { setOpenMobile, isMobile } = useSidebar();
  const user = useUser();
  const router = useRouter();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="rounded-lg w-8 h-8">
                <AvatarImage
                  src={user.user?.imageUrl}
                  alt={user.user?.fullName ?? ""}
                />
                <AvatarFallback className="rounded-lg">
                  <User />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 grid text-left text-sm leading-tight">
                <span className="font-semibold truncate">
                  {user.user?.fullName}
                </span>
                <span className="text-xs truncate">
                  {user.user?.emailAddresses[0]?.emailAddress}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="rounded-lg w-[--radix-dropdown-menu-trigger-width] min-w-56"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="rounded-lg w-8 h-8">
                  <AvatarImage
                    src={user.user?.imageUrl}
                    alt={user.user?.fullName ?? ""}
                  />
                  <AvatarFallback className="rounded-lg">
                    <User />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 grid text-left text-sm leading-tight">
                  <span className="font-semibold truncate">
                    {user.user?.fullName}
                  </span>
                  <span className="text-xs truncate">
                    {user.user?.emailAddresses[0]?.emailAddress}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ThemeToggle />
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Button
                  onClick={() => {
                    isMobile && setOpenMobile(false);
                    router.push("/user-profile");
                  }}
                  variant="ghost"
                  size="xs"
                  className="flex justify-start gap-2 w-full"
                >
                  Mi Cuenta
                </Button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Button
                asChild
                variant="ghost"
                size="xs"
                className="flex justify-start gap-2 w-full"
              >
                <SignOutButton>Salir</SignOutButton>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
