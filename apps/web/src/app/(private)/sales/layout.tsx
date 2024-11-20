import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Ventas | ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: "Administra tus ventas",
};

const ConfigurationLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export default ConfigurationLayout;
