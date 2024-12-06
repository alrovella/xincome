import { EdgeStoreProvider } from "@/providers/EdgeStoreProvider";

const ProductImagesLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <EdgeStoreProvider>{children}</EdgeStoreProvider>;
};

export default ProductImagesLayout;
