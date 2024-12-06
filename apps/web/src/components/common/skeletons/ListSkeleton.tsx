import { Skeleton } from "@repo/ui/components/ui/skeleton";
import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
  TableHead,
  TableBody,
} from "@repo/ui/components/ui/table";

export default function ListSkeleton() {
  const SkeletonRow = () => (
    <TableRow>
      <TableCell>
        <Skeleton className="w-[100px] h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-[200px] h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-[150px] h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-[100px] h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-[100px] h-8" />
      </TableCell>
    </TableRow>
  );

  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Skeleton className="w-[100px] h-4" />
            </TableHead>
            <TableHead>
              <Skeleton className="w-[200px] h-4" />
            </TableHead>
            <TableHead>
              <Skeleton className="w-[150px] h-4" />
            </TableHead>
            <TableHead>
              <Skeleton className="w-[100px] h-4" />
            </TableHead>
            <TableHead>
              <Skeleton className="w-[100px] h-4" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <SkeletonRow key={index} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
