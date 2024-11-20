import { formatPrice } from "@/util/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@repo/ui/components/ui/table";
const TotalSummary = ({
  subTotal,
  discount,
  otherCharges,
  total,
}: {
  subTotal?: number;
  discount?: number;
  otherCharges?: number;
  total?: number;
}) => {
  return (
    <Table className="bg-secondary mb-2">
      <TableBody>
        <TableRow>
          <TableCell>SubTotal</TableCell>
          <TableCell className="text-right">
            {formatPrice(subTotal ?? 0)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Descuento ($) </TableCell>
          <TableCell className="text-right">
            {formatPrice(discount ?? 0)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Otros cargos ($) </TableCell>
          <TableCell className="text-right">
            {formatPrice(otherCharges ?? 0)}
          </TableCell>
        </TableRow>
        <TableRow className="font-bold text-sm md:text-lg">
          <TableCell>Total</TableCell>
          <TableCell className="text-right">
            {formatPrice(total ?? 0)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default TotalSummary;
