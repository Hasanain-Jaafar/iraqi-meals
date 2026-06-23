"use client"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIsFavorite, useToggleFavorite } from "@/lib/favorites"

export function AddToFavoriteButton({ slug }: { slug: string }) {
  const favorited = useIsFavorite(slug)
  const toggle = useToggleFavorite()

  return (
    <Button
      variant="accent"
      size="lg"
      className="w-full"
      aria-pressed={favorited}
      onClick={() => toggle(slug)}
    >
      <Heart
        size={18}
        strokeWidth={1.75}
        fill={favorited ? "currentColor" : "none"}
      />
      {favorited ? "في المفضلة" : "أضف إلى المفضلة"}
    </Button>
  )
}
