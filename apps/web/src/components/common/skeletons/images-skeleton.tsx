import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { cn } from "@repo/ui/lib/utils";

const ImagesSkeleton = ({
  className,
  imagesCount = 6,
}: {
  className?: string;
  imagesCount?: number;
}) => {
  return (
    <div className={cn("p-4 ", className)}>
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(imagesCount)].map((_, index) => (
          <div
            key={`image-skeleton-${
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              index
            }`}
            className="relative aspect-square"
          >
            <Skeleton className="absolute inset-0 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagesSkeleton;
