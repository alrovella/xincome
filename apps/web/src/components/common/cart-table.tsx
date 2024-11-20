import { usePurchaseStore } from "@/hooks/stores/usePurchaseStore";
import { useSaleStore } from "@/hooks/stores/useSaleStore";

import type { CartItem } from "@/types/types";
import { formatPrice } from "@/util/utils";
import { Button } from "@repo/ui/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@repo/ui/components/ui/table";
import { ShoppingBasket, X } from "lucide-react";
import EmptyStateAlert from "./empty-state-alert";

const CartTable = ({
  isPurchase,
  items,
}: {
  isPurchase: boolean;
  items: CartItem[];
}) => {
  const { removeItem: removePurchaseItem } = usePurchaseStore();
  const { removeItem: removeSaleItem } = useSaleStore();

  const handleRemoveItem = (item: CartItem) => {
    if (isPurchase) {
      removePurchaseItem(item.id);
    } else {
      removeSaleItem(item.id);
    }
  };
  return (
    <>
      {items.length === 0 && (
        <EmptyStateAlert>
          <ShoppingBasket className="mb-4 text-destructive size-12" />
          <h2 className="mb-2 font-semibold text-2xl">
            No hay productos en el carrito
          </h2>
        </EmptyStateAlert>
      )}
      {items.length > 0 && (
        <Table className="mb-2">
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead className="text-center">Talle</TableHead>
              <TableHead className="text-center">Cantidad</TableHead>
              <TableHead className="text-right hidden sm:table-cell">
                {isPurchase ? "Costo" : "Precio"}
              </TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead> </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={`${item.productId}-${index}`}>
                <TableCell>{item.productName}</TableCell>
                <TableCell className="text-center">
                  {item.productSizeId}
                </TableCell>
                <TableCell className="text-center">{item.quantity}</TableCell>
                <TableCell className="text-right hidden sm:table-cell">
                  {formatPrice(item.productValue)}
                </TableCell>
                <TableCell className="text-right">
                  {formatPrice(item.total)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => handleRemoveItem(item)}
                    type="button"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    variant="ghost"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default CartTable;
