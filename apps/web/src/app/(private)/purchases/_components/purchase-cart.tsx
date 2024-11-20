"use client";

import CartTable from "@/components/common/cart-table";
import { usePurchaseStore } from "@/hooks/stores/usePurchaseStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/components/ui/alert-dialog";
import { Button } from "@repo/ui/components/ui/button";

const PurchaseCart = () => {
  const { items, clearItems, setSupplierId } = usePurchaseStore();

  const handleClickClearCart = () => {
    clearItems();
    setSupplierId(undefined);
  };

  return (
    <div className="flex flex-col gap-4">
      <CartTable isPurchase items={items} />
      {items.length > 0 && (
        <AlertDialog>
          <AlertDialogTrigger asChild className="mx-auto mb-4">
            <Button type="button" variant="destructiveOutline">
              Vaciar Carrito
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Estas segura de vaciar el carrito?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cerrar</AlertDialogCancel>
              <AlertDialogAction onClick={handleClickClearCart}>
                Vaciar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default PurchaseCart;
