import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import { PurchaseCartCount } from "../_components/purchase-cart-count";
import PurchaseCart from "../_components/purchase-cart";
import PurchaseCartCheckout from "../_components/purchase-cart-checkout";
import PurchaseCartProductList from "@/app/(private)/purchases/_components/purchase-cart-product-list";
import PurchaseSupplierSelect from "@/app/(private)/purchases/_components/purchase-supplier-select";
import { Container } from "@repo/ui/components/ui/container";

export default function Page() {
  return (
    <Container title="Nueva Compra">
      <Tabs defaultValue="products">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="checkout">
            Finalizar Compra ({<PurchaseCartCount />})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="mb-4">
          <PurchaseSupplierSelect />
          <PurchaseCartProductList />
        </TabsContent>
        <TabsContent value="checkout" className="mb-4">
          <PurchaseCart />
          <PurchaseCartCheckout />
        </TabsContent>
      </Tabs>
    </Container>
  );
}
