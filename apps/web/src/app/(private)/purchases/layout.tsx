import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Compras | ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: "Administra tus compras",
};

const ConfigurationLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export default ConfigurationLayout;
