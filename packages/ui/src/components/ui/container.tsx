import { Card, CardContent } from "@repo/ui/components/ui/card";
import { cn } from "@repo/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const containerVariants = cva(
  "relative shadow-none mx-auto md:p-4 rounded-sm overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-background bg-background dark:border-slate dark:bg-slate",
        destructive:
          "md:border-destructive/20 md:bg-destructive/15 dark:border-destructive/20 dark:bg-destructive/15",
        secondary: "border-secondary bg-secondary/80",
      },
      size: {
        default: "max-w-full",
        sm: "max-w-sm",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
        "6xl": "max-w-6xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ContainerProps extends VariantProps<typeof containerVariants> {
  title?: string;
  className?: string;
  children?: React.ReactNode;
  headerChildren?: React.ReactNode;
}

export const Container = ({
  title,
  children,
  className,
  variant,
  size,
  headerChildren,
}: ContainerProps) => {
  return (
    <Card
      className={cn("mb-4", containerVariants({ variant, size, className }))}
    >
      <div
        className={cn(
          "my-0 py-0 px-1 md:py-2 mb-2 flex flex-row justify-between items-center h-auto",
          variant === "default" || !variant ? "border-b pb-2" : ""
        )}
      >
        <div className="flex justify-between items-end w-full">
          <h1 className="font-bold text-2xl">{title}</h1>
          {headerChildren && <div>{headerChildren}</div>}
        </div>
      </div>
      <CardContent className="mt-8 px-1 py-0">{children}</CardContent>
    </Card>
  );
};
