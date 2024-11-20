import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Talles de Productos | ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: "Administra los talles de tus productos",
};

const ConfigurationLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export default ConfigurationLayout;
