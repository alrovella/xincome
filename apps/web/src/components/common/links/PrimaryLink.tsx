import type { ReactNode } from "react";
import Link from "next/link";
import { buttonVariants } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";

const PrimaryLink = ({
  children,
  href,
  className,
}: {
  children: ReactNode;
  href: string;
  className?: string;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: "shine", size: "xs" }),
        className
      )}
    >
      {children}
    </Link>
  );
};

export default PrimaryLink;
