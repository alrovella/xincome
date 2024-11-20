import ReactQueryProvider from "@/providers/react-query-provider"

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  return <ReactQueryProvider>{children}</ReactQueryProvider>
}

export default PublicLayout
