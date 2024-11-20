import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Proveedores | ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: "Administrar proveedores",
};

const ConfigurationLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export default ConfigurationLayout;
