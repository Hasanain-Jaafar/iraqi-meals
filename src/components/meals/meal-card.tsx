import Link from "next/link"
import { Clock } from "lucide-react"
import { MealImage } from "./meal-image"
import { FavoriteButton } from "./favorite-button"
import { Badge } from "@/components/ui/badge"
import type { Meal } from "@/types/meal"

export function MealCard({ meal, priority = false }: { meal: Meal; priority?: boolean }) {
  return (
    <Link
      href={`/meals/${meal.slug}`}
      className="glass-card rounded-lg overflow-hidden flex flex-col group"
    >
      <div className="relative aspect-square w-full bg-secondary">
        <MealImage
          src={meal.image}
          alt={meal.name}
          sizes="(max-width: 640px) 50vw, 25vw"
          priority={priority}
        />
        <FavoriteButton
          slug={meal.slug}
          size={16}
          className="absolute top-2 start-2 p-1.5"
        />
      </div>
      <div className="flex flex-col gap-1.5 p-4">
        <h3 className="text-base font-semibold line-clamp-1">{meal.name}</h3>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={14} strokeWidth={1.75} />
            <span className="ltr-numerals">{meal.timeOfCook}</span>
          </span>
          <Badge
            variant="default"
            className="line-clamp-1 rounded-md border border-gray-300"
          >
            {meal.category}
          </Badge>
        </div>
      </div>
    </Link>
  )
}
