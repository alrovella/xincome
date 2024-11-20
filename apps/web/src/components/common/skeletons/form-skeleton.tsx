import { Skeleton } from "@repo/ui/components/ui/skeleton";

export default function FormSkeleton() {
  return (
    <div className="my-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="w-1/4 h-4" />
          <Skeleton className="w-full h-10" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-1/4 h-4" />
          <Skeleton className="w-full h-10" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-1/4 h-4" />
          <Skeleton className="w-full h-20" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="w-1/4 h-4" />
        </div>
      </div>
    </div>
  );
}
