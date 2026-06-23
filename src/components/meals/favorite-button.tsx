"use client"
import { Heart } from "lucide-react"
import { useIsFavorite, useToggleFavorite } from "@/lib/favorites"
import { cn } from "@/lib/utils"

export function FavoriteButton({
  slug,
  className,
  size = 20,
}: {
  slug: string
  className?: string
  size?: number
}) {
  const favorited = useIsFavorite(slug)
  const toggle = useToggleFavorite()

  return (
    <button
      type="button"
      aria-label={favorited ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
      aria-pressed={favorited}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(slug)
      }}
      className={cn("glass-card rounded-full p-2.5 shrink-0", className)}
    >
      <Heart
        size={size}
        strokeWidth={1.75}
        className={favorited ? "text-[var(--accent-color)]" : "text-foreground"}
        fill={favorited ? "var(--accent-color)" : "none"}
      />
    </button>
  )
}
