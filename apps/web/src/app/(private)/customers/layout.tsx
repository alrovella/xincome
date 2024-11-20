import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Clientes | ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: "Administra tus clientes",
};

const ConfigurationLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export default ConfigurationLayout;
