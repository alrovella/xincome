import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Servicios | ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: "Administrar servicios",
};

const ConfigurationLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export default ConfigurationLayout;
