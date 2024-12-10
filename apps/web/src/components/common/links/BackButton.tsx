"use client";
import type { ReactNode } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { useRouter } from "next/navigation";

const BackButton = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className={cn(className)}
      onClick={() => router.back()}
    >
      {children}
    </Button>
  );
};

export default BackButton;
