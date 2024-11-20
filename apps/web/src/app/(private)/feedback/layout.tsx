import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Feedback | ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: "Feedback",
};

const ConfigurationLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export default ConfigurationLayout;
