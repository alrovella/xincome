import Logo from "@/components/common/logo";
import { getLoggedInUser } from "@/server/queries/users";
import { buttonVariants } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getLoggedInUser();
  if (user) return redirect("/dashboard");
  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen animate-gradient-x">
      <div className="flex flex-col space-y-8 bg-white bg-opacity-70 shadow-lg backdrop-blur-sm p-8 w-full">
        <div className="flex flex-col justify-start items-center gap-1">
          <Logo className="w-[50px]" />
          <h1 className="mb-2 font-bold text-2xl">
            {process.env.NEXT_PUBLIC_APP_NAME}
          </h1>
          <p className="font-semibold text-sm">Admin+Stock+Turnos</p>
          <p className="text-sm">Administración inteligente de tu negocio</p>
        </div>
        <div className="flex sm:flex-row flex-col justify-center sm:space-x-4 space-y-4 sm:space-y-0">
          <Link
            href="/sign-up"
            className={cn(
              "md:w-[150px]",
              buttonVariants({ variant: "outline" })
            )}
          >
            Registrarme
          </Link>
          <Link
            href="/sign-in"
            className={cn(
              "md:w-[150px]",
              buttonVariants({ variant: "default" })
            )}
          >
            Ingresar
          </Link>
        </div>
      </div>
    </div>
  );
}
