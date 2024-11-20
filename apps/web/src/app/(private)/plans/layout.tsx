import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Planes | ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: "Elegi el plan de acuerdo a tus necesidades",
};

const ConfigurationLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export default ConfigurationLayout;
