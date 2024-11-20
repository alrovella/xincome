import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Mi Cuenta | ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: "Administra los datos de tu cuenta",
};

const ConfigurationLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export default ConfigurationLayout;
