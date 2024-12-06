"use client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { useProducts } from "@/hooks/queries/useProducts";
import ListSkeleton from "@/components/common/skeletons/ListSkeleton";
import { useSaleStore } from "@/hooks/stores/useSaleStore";
import SaleCartProductListItem from "@/app/(private)/sales/_components/sale-cart-product-list-item";
import EmptyStateAlert from "@/components/common/EmptyStateAlert";
const SaleCartProductList = () => {
  const { supplierId } = useSaleStore();

  const { data: products, isLoading: isLoadingProducts } = useProducts({
    supplierId,
    page: 1,
    limit: 100000,
  });

  return products && products?.data.length === 0 ? (
    <EmptyStateAlert>
      <p className="text-sm">El proveedor no tiene productos cargados</p>
    </EmptyStateAlert>
  ) : (
    <>
      {isLoadingProducts ? (
        <ListSkeleton />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3 font-bold">Producto</TableHead>
              <TableHead className="w-1/4 font-bold">Talle</TableHead>
              <TableHead className="w-1/4 font-bold">Cantidad</TableHead>
              <TableHead className="w-1/3 font-bold">Precio</TableHead>
              <TableHead className="text-right hidden w-auto font-bold sm:table-cell">
                {" "}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.data.map((product, index) => (
              <SaleCartProductListItem
                key={`${product.id}${index}`}
                product={product}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default SaleCartProductList;
