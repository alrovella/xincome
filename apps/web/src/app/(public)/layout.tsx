import ReactQueryProvider from "@/providers/ReactQueryProvider";

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
};

export default PublicLayout;
