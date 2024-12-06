import { cn } from "@repo/ui/lib/utils";

function EmptyStateAlert({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return (
    <div
      className={cn(
        "w-full border-destructive/10 bg-destructive/5 border rounded-md p-8 text-destructive my-2 flex flex-col items-center justify-center",
        className
      )}
    >
      {children}
    </div>
  );
}

export default EmptyStateAlert;
