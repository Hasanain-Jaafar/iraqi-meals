"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LayoutGrid, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

const TABS = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/meals", label: "الأصناف", icon: LayoutGrid },
  { href: "/favorites", label: "المفضلة", icon: Heart },
] as const

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 glass-card border-t-0 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2"
      aria-label="التنقل الرئيسي"
    >
      <ul className="flex items-center justify-around max-w-md mx-auto">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl text-xs transition-colors",
                  active
                    ? "text-[var(--accent-color)]"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon
                  size={20}
                  strokeWidth={1.75}
                  className={active ? "text-[var(--accent-color)]" : undefined}
                />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
