import { cn } from "@repo/ui/lib/utils";

const Logo = ({ className }: { className?: string }) => {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <rect width="40" height="40" rx="8" fill="#FF6B00" />
      <path
        d="M12 12L28 28M28 12L12 28"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Logo;
