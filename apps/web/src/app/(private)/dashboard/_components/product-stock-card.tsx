"use client";
import { useStockReport } from "@/hooks/queries/useReports";
import EmptyStateAlert from "../../../../components/common/EmptyStateAlert";
import ListSkeleton from "../../../../components/common/skeletons/ListSkeleton";
import { useEffect, useState } from "react";
import type { ProductStock } from "@/types/entities/products";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@repo/ui/components/ui/select";
import { cn } from "@repo/ui/lib/utils";
import { ArrowUpDown } from "lucide-react";

const sortOptions = [
  { name: "Mas Stock", key: "stockDesc" },
  { name: "Menos Stock", key: "stockAsc" },
  { name: "Por Talle", key: "sizeAsc" },
  { name: "A a Z", key: "nameAsc" },
  { name: "Z a A", key: "nameDesc" },
  { name: "Menos Vendido", key: "salesAsc" },
  { name: "Mas Vendido", key: "salesDesc" },
  { name: "Menos Comprado", key: "purchasesAsc" },
  { name: "Mas Comprado", key: "purchasesDesc" },
];

const ProductStockCard = () => {
  const { data, isLoading, isRefetching } = useStockReport();

  const [sortedStock, setSortedStock] = useState<ProductStock[]>([]);
  const [sortBy, setSortBy] = useState("stockAsc");

  useEffect(() => {
    if (data) {
      setSortedStock(data);
    }
  }, [data]);

  const handleSort = (sortCriteria: string) => {
    const sortedList = [...sortedStock].sort(
      (a: ProductStock, b: ProductStock) => {
        if (sortCriteria === "sizeAsc") {
          if (!a.productSizeName) return 1;
          if (!b.productSizeName) return -1;
          return a.productSizeName.localeCompare(b.productSizeName);
        }
        if (sortCriteria === "stockAsc") return a.stock - b.stock;
        if (sortCriteria === "stockDesc") return b.stock - a.stock;
        if (sortCriteria === "nameAsc")
          return a.productName.localeCompare(b.productName);
        if (sortCriteria === "nameDesc")
          return b.productName.localeCompare(a.productName);
        if (sortCriteria === "salesAsc") return a.totalSales - b.totalSales;
        if (sortCriteria === "salesDesc") return b.totalSales - a.totalSales;
        if (sortCriteria === "purchasesAsc")
          return a.totalPurchases - b.totalPurchases;
        if (sortCriteria === "purchasesDesc")
          return b.totalPurchases - a.totalPurchases;
        return 0;
      }
    );
    setSortedStock(sortedList);
    setSortBy(sortCriteria);
  };

  return (
    <>
      {isLoading || isRefetching ? (
        <ListSkeleton />
      ) : (
        <>
          {!data || data.length === 0 ? (
            <EmptyStateAlert>
              No hay datos disponibles para generar el reporte
            </EmptyStateAlert>
          ) : (
            <>
              <div className="flex items-center gap-1 mb-2">
                <label htmlFor="sort">
                  <ArrowUpDown className="w-4 h-4" />
                </label>
                <Select
                  name="sort"
                  defaultValue={sortBy}
                  onValueChange={(e) => handleSort(e)}
                >
                  <SelectTrigger className="w-fit md:w-[260px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.key} value={option.key}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted/0">
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-center">Talle</TableHead>
                    <TableHead className="hidden text-center md:table-cell">
                      Comprado
                    </TableHead>
                    <TableHead className="hidden text-center md:table-cell">
                      Vendido
                    </TableHead>
                    <TableHead className="font-bold text-center">
                      Stock
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedStock?.map((item, index) => (
                    <TableRow
                      key={`${item.productId}-${index}`}
                      className={cn(
                        item.stock <= 3 &&
                          "bg-yellow-200 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-800",
                        item.stock === 0 &&
                          "bg-red-200 text-destructive hover:bg-red-200 hover:text-destructive"
                      )}
                    >
                      <TableCell className="font-medium">
                        <span className="font-bold md:font-normal">
                          {item.productName}
                        </span>
                        <div className="md:hidden grid grid-cols-2">
                          <p>Comprado: </p>
                          <p>{item.totalPurchases}</p>
                          <p>Vendido: </p>
                          <p>{item.totalSales}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {item.productSizeName}
                      </TableCell>
                      <TableCell className="hidden text-center md:table-cell">
                        {item.totalPurchases}
                      </TableCell>
                      <TableCell className="hidden text-center md:table-cell">
                        {item.totalSales}
                      </TableCell>
                      <TableCell className="font-bold text-center">
                        {item.stock}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow className="hover:bg-muted/0">
                    <TableHead>
                      <div className="md:hidden grid grid-cols-2 font-bold">
                        <p>Total Comprado:</p>
                        <p>
                          {data?.reduce(
                            (acc, item) => acc + item.totalPurchases,
                            0
                          )}
                        </p>
                        <p>Total Vendido: </p>
                        <p>
                          {data?.reduce(
                            (acc, item) => acc + item.totalSales,
                            0
                          )}
                        </p>
                      </div>
                    </TableHead>
                    <TableHead className="text-left"> </TableHead>
                    <TableHead className="hidden text-center md:table-cell">
                      {data?.reduce(
                        (acc, item) => acc + item.totalPurchases,
                        0
                      )}
                    </TableHead>
                    <TableHead className="hidden text-center md:table-cell">
                      {data?.reduce((acc, item) => acc + item.totalSales, 0)}
                    </TableHead>
                    <TableHead className="font-bold text-center">
                      {data?.reduce((acc, item) => acc + item.stock, 0)}
                    </TableHead>
                  </TableRow>
                </TableFooter>
              </Table>
            </>
          )}
        </>
      )}
    </>
  );
};

export default ProductStockCard;
