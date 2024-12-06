import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@repo/ui/components/ui/card";
import { Skeleton } from "@repo/ui/components/ui/skeleton";

export default function CardsSkeleton() {
  // Función para generar un solo card skeleton
  const CardSkeleton = () => (
    <Card className="w-full card">
      <CardHeader className="p-0 border-b card-header">
        <Skeleton className="rounded-t-lg h-48" />
      </CardHeader>
      <CardContent className="space-y-2 p-4 min-h-[200px]">
        <Skeleton className="w-2/3 h-4" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
      </CardContent>
      <CardFooter className="flex justify-between p-4 card-footer">
        <Skeleton className="w-24 h-8" />
        <Skeleton className="w-16 h-8" />
      </CardFooter>
    </Card>
  );

  // Generar una grilla de 8 card skeletons
  return (
    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <CardSkeleton
          key={`card-skeleton-${
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            i
          }`}
        />
      ))}
    </div>
  );
}
