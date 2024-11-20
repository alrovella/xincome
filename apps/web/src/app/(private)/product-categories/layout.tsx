import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Categorias de Productos | ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: "Administra las categorias de tus productos",
};

const ConfigurationLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export default ConfigurationLayout;
