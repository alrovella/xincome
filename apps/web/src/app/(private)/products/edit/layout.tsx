import { EdgeStoreProvider } from "@/providers/edgestore-provider";

const ProductImagesLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <EdgeStoreProvider>{children}</EdgeStoreProvider>;
};

export default ProductImagesLayout;
