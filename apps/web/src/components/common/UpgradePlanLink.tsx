import { buttonVariants } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { Sparkles } from "lucide-react";
import Link from "next/link";

const UpgradePlanLink = () => {
  return (
    <Link
      href="/plans"
      className={cn(
        "flex items-center gap-1",
        buttonVariants({ variant: "outline", size: "sm" })
      )}
    >
      <Sparkles className="size-4" />
      Actualizar Plan
    </Link>
  );
};

export default UpgradePlanLink;
