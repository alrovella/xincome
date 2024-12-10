import { cn } from "@repo/ui/lib/utils";

export default function FormFieldContainer({
  className,
  children,
}: Readonly<{ className?: string; children: React.ReactNode }>) {
  return (
    <div className={cn("gap-6 grid grid-cols-1 md:grid-cols-2", className)}>
      {children}
    </div>
  );
}
