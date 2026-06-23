"use client"
import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { MealCard } from "./meal-card"
import { cn } from "@/lib/utils"
import type { Meal } from "@/types/meal"

export function MealsBrowser({
  meals,
  categories,
}: {
  meals: Meal[]
  categories: string[]
}) {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") ?? "الكل"
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    let result = meals
    if (activeCategory !== "الكل") {
      result = result.filter((m) => m.category === activeCategory)
    }
    const q = query.trim().toLowerCase()
    if (q) {
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.ingredients.some((i) => i.toLowerCase().includes(q))
      )
    }
    return result
  }, [meals, activeCategory, query])

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search
          size={18}
          strokeWidth={1.75}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن أكلة أو مكوّن..."
          className="w-full h-12 rounded-xl border border-border bg-card pr-11 pl-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-none">
        {["الكل", ...categories].map((cat) => {
          const active = cat === activeCategory
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded-md px-4 py-2 text-sm whitespace-nowrap shrink-0 transition-colors",
                active
                  ? "bg-[var(--accent-color)] text-[var(--accent-foreground)]"
                  : "glass-card text-foreground"
              )}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-12 px-6 glass-card rounded-3xl">
          <h3 className="text-lg font-semibold mb-2">لا توجد نتائج</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            جرّب كلمة بحث أخرى أو اختر صنفًا مختلفًا
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((meal) => (
            <MealCard key={meal.slug} meal={meal} />
          ))}
        </div>
      )}
    </div>
  )
}
