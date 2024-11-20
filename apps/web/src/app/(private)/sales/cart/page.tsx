import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import { SaleCartCount } from "../_components/sale-cart-count";
import SaleTypeSwitch from "../_components/sale-type-switch";
import SaleCartCheckout from "../_components/sale-cart-checkout";
import SaleCartProductList from "../_components/sale-cart-product-list";
import SaleSupplierSelect from "../_components/sale-supplier-select";
import { Container } from "@repo/ui/components/ui/container";

export default async function Page() {
  return (
    <Container title="Nueva Venta">
      <Tabs defaultValue="products">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="checkout">
            Carrito ({<SaleCartCount />})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <div className="items-center grid grid-cols-2">
            <SaleSupplierSelect />
            <div>
              <SaleTypeSwitch />
            </div>
          </div>
          <SaleCartProductList />
        </TabsContent>
        <TabsContent value="checkout">
          <SaleCartCheckout />
        </TabsContent>
      </Tabs>
    </Container>
  );
}
