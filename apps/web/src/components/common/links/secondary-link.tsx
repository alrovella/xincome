import type { ReactNode } from "react";
import Link from "next/link";
import { buttonVariants } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";

const SecondaryLink = ({
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
        "border",
        buttonVariants({ variant: "outline", size: "xs" }),
        "flex gap-1 items-center",
        className
      )}
    >
      {children}
    </Link>
  );
};

export default SecondaryLink;
