import type { Metadata } from "next";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@repo/ui/components/ui/sidebar";
import ReactQueryProvider from "@/providers/react-query-provider";
import { Toaster } from "react-hot-toast";
import { getLoggedInUser } from "@/server/queries/users";
import { RedirectToSignIn } from "@clerk/nextjs";
import { UserContextProvider } from "@/providers/user-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { AppSidebar } from "@/components/common/layout/app-sidebar";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: process.env.NEXT_PUBLIC_APP_NAME,
};

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedInUser = await getLoggedInUser();
  if (!loggedInUser) return <RedirectToSignIn />;
  return (
    <UserContextProvider value={loggedInUser}>
      <ReactQueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <Toaster />
            <AppSidebar />
            <SidebarInset>
              <div className="flex items-center gap-2 mt-4 px-4">
                <SidebarTrigger />
              </div>
              <main className="px-4 py-0">{children}</main>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </ReactQueryProvider>
    </UserContextProvider>
  );
}
