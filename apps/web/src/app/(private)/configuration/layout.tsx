import { EdgeStoreProvider } from "@/providers/edgestore-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Configuración | ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: "Configuración de tu negocio",
};

const ConfigurationLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <EdgeStoreProvider>{children}</EdgeStoreProvider>;
};

export default ConfigurationLayout;
