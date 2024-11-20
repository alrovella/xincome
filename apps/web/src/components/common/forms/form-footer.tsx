import { cn } from "@repo/ui/lib/utils";

const FormFooter = ({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={cn("flex justify-end items-center gap-2 mt-4", className)}>
      {children}
    </div>
  );
};

export default FormFooter;
