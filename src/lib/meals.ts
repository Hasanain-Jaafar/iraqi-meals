import mealsData from "@/data/meals.json"
import type { Meal } from "@/types/meal"

/**
 * Single source of truth for reading meal data. Components should always
 * import from here — never `import meals from "@/data/meals.json"` directly
 * in a component — so that if the data source ever changes (e.g. moves to a
 * CMS), only this file needs to change.
 */
const meals = mealsData as Meal[]

export function getAllMeals(): Meal[] {
  return meals
}

export function getMealBySlug(slug: string): Meal | undefined {
  return meals.find((m) => m.slug === slug)
}

export function getAllSlugs(): string[] {
  return meals.map((m) => m.slug)
}

/** Categories derived from the live data, in first-seen order — never
 * hand-maintain this list separately, it will drift. See CLAUDE.md §3. */
export function getAllCategories(): string[] {
  return [...new Set(meals.map((m) => m.category))]
}

export function getMealsByCategory(category: string): Meal[] {
  if (category === "الكل") return meals
  return meals.filter((m) => m.category === category)
}

/** Simple substring search across name + ingredients, diacritics-naive
 * (Arabic text in this dataset has no tashkeel, so naive .includes() is
 * fine — revisit with normalization if a future data source adds tashkeel). */
export function searchMeals(query: string): Meal[] {
  const q = query.trim().toLowerCase()
  if (!q) return meals
  return meals.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.ingredients.some((i) => i.toLowerCase().includes(q))
  )
}
