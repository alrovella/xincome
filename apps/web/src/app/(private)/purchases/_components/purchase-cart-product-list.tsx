"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { useProducts } from "@/hooks/queries/useProducts";
import { usePurchaseStore } from "@/hooks/stores/usePurchaseStore";
import ListSkeleton from "@/components/common/skeletons/list-skeleton";
import PurchaseCartProductListItem from "./purchase-cart-product-list-item";
import EmptyStateAlert from "@/components/common/empty-state-alert";
const PurchaseCartProductList = () => {
  const { supplierId } = usePurchaseStore();

  const { data: products, isLoading: isLoadingProducts } = useProducts({
    supplierId,
    page: 1,
    limit: 100000,
  });

  return products && products?.data.length === 0 ? (
    <EmptyStateAlert>
      <EmptyStateAlert>
        <p className="text-sm">El proveedor no tiene productos cargados</p>
      </EmptyStateAlert>
    </EmptyStateAlert>
  ) : (
    <>
      {isLoadingProducts ? (
        <ListSkeleton />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Producto</TableHead>
              <TableHead className="font-bold">Talle</TableHead>
              <TableHead className="font-bold">Cantidad</TableHead>
              <TableHead className="font-bold">Costo</TableHead>
              <TableHead className="text-right hidden font-bold sm:table-cell">
                {" "}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.data.map((product, index) => (
              <PurchaseCartProductListItem
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

export default PurchaseCartProductList;
