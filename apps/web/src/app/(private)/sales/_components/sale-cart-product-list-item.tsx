"use client";
import type { CartItem } from "@/types/types";
import { Button } from "@repo/ui/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@repo/ui/components/ui/select";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Input } from "@repo/ui/components/ui/input";
import { TableCell, TableRow } from "@repo/ui/components/ui/table";
import toast from "react-hot-toast";
import { formatPrice } from "@/util/utils";
import { useSaleStore } from "@/hooks/stores/useSaleStore";
import { getProductStock } from "@/server/queries/products";
import type { ProductListItem } from "@/types/entities/products";
import { useProductSizes } from "@/hooks/queries/useProductSizes";

const SaleCartProductListItem = ({ product }: { product: ProductListItem }) => {
  const [isAdding, startTransition] = useTransition();

  const [quantity, setQuantity] = useState(1);
  const [sizeId, setSizeId] = useState<number | undefined>();
  const { data: sizes, isLoading: isLoadingSizes } = useProductSizes();

  const { addItem, getStock, saleType } = useSaleStore();

  const handleSizeChange = (sizeId: number) => {
    setSizeId(sizeId);
  };

  const handleQuantityChange = (quantity: number) => {
    setQuantity(quantity);
  };

  const addToCart = (productId: number, quantity: number, sizeId?: number) => {
    if (product === undefined) return;

    getProductStock(productId, sizeId).then((stock) => {
      if (stock === 0) {
        toast.error("No hay stock disponible");
        return;
      }

      if (stock < quantity + getStock(productId, sizeId)) {
        const unitDescription =
          stock === 1 ? "unidad disponible" : "unidades disponibles";

        toast.error(`Solo hay ${stock} ${unitDescription}`);

        return;
      }

      addItem({
        productId: productId,
        productName: product.name,
        productSizeId: sizeId,
        productSizeName: sizeId
          ? sizes?.find((s) => s.id === sizeId)?.name
          : "",
        productValue:
          saleType === "reseller" ? product.resellerPrice : product.price,
        quantity,
        total: 0,
      } as CartItem);

      toast.success(`${product.name} agregado al carrito`);
    });
  };

  useEffect(() => {
    if (sizes && sizes.length > 0) {
      setSizeId(sizes[0]?.id);
    }
  }, [sizes]);

  return (
    <TableRow>
      <TableCell>{product.name}</TableCell>
      <TableCell>
        <Select
          disabled={!product.hasSizes || sizes?.length === 0 || isLoadingSizes}
          name="sizeId"
          value={sizeId ? String(sizeId) : undefined}
          onValueChange={(e) => handleSizeChange(Number(e))}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Seleccionar Tamaño" />
          </SelectTrigger>
          <SelectContent>
            {sizes?.map((size) => (
              <SelectItem key={size.id} value={String(size.id)}>
                {size.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Input
          name="quantity"
          type="number"
          defaultValue="1"
          min="1"
          className="w-full md:w-[180px]"
          onChange={(e) => handleQuantityChange(Number(e.target.value))}
        />
      </TableCell>
      <TableCell>
        {formatPrice(
          saleType === "reseller" ? product.resellerPrice : product.price
        )}
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="outline"
          type="button"
          size="icon"
          disabled={isAdding}
          onClick={() =>
            startTransition(async () => {
              addToCart(
                product.id,
                quantity ?? 1,
                product.hasSizes ? (sizeId ?? sizes?.[0]?.id) : undefined
              );
            })
          }
        >
          <ShoppingCart className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default SaleCartProductListItem;