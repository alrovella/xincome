"use client"
import { cn } from "@repo/ui/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NavLink = ({
  className,
  href,
  children,
  onClick,
}: {
  className?: string
  href: string
  children: React.ReactNode
  onClick?: () => void
}) => {
  const path = usePathname()

  const isActive = path === href

  return (
    <Link
      onClick={onClick}
      className={cn(
        "transition-colors",
        isActive
          ? "!text-primary"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
      href={href}
    >
      {children}
    </Link>
  )
}

export default NavLink
