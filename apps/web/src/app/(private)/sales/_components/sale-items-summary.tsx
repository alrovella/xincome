import type { ExtendedSaleItem } from "@/types/entities/sales";
import { formatPrice } from "@/util/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@repo/ui/components/ui/table";

const SaleItemsSummary = ({ items }: { items: ExtendedSaleItem[] }) => {
  return (
    <div className="m-w-[350px] h-[200px] overflow-auto">
      <Table>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.product.name}</TableCell>
              <TableCell>{item.productSize?.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell className="text-right">
                {formatPrice(item.price)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SaleItemsSummary;
