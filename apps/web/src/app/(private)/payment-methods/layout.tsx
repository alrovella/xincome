import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Metodos de Pago | ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: "Administra tus metodos de pago",
};

const ConfigurationLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export default ConfigurationLayout;
