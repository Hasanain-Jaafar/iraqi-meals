"use client"
import { Heart } from "lucide-react"
import { MealCard } from "./meal-card"
import { useFavoriteSlugs } from "@/lib/favorites"
import type { Meal } from "@/types/meal"

export function FavoritesBrowser({ meals }: { meals: Meal[] }) {
  const favoriteSlugs = useFavoriteSlugs()
  const favorites = meals.filter((m) => favoriteSlugs.includes(m.slug))

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-6 glass-card rounded-3xl">
        <Heart size={28} strokeWidth={1.75} className="text-muted-foreground mb-3" />
        <h3 className="text-lg font-semibold mb-2">لا توجد أكلات مفضّلة بعد</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          اضغط على أيقونة القلب على أي أكلة لإضافتها هنا
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {favorites.map((meal) => (
        <MealCard key={meal.slug} meal={meal} />
      ))}
    </div>
  )
}
