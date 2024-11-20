import { getAllProducts } from "@/server/queries/products";
import PurchaseCartProductListItem from "./purchase-cart-product-list-item";

const PurchaseCartList = async () => {
  const products = await getAllProducts({ page: 1, limit: 100000 });
  return (
    <>
      <div className="grid grid-cols-5 px-4 py-2 border-b">
        <div className="w-auto">Producto</div>
        <div className="w-24">Talle</div>
        <div className="w-24">Cantidad</div>
        <div className="text-right hidden sm:table-cell">Precio</div>
        <div> </div>
      </div>
      {products.data.map((product) => (
        <PurchaseCartProductListItem key={product.id} product={product} />
      ))}
    </>
  );
};

export default PurchaseCartList;
