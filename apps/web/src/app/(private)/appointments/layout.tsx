import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Agendas | ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: "Administra las agendas de tu negocio",
};

const ConfigurationLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export default ConfigurationLayout;
