/**
 * Canonical shape of a meal, post-transform (see scripts/transform-meals.mjs).
 * Import this everywhere instead of inferring shape from the JSON import —
 * keeps a single source of truth if a field is ever added/renamed.
 */
export interface Meal {
  slug: string
  name: string
  category: string
  ingredients: string[]
  steps: string[]
  timeOfCook: string
  portion: string
  image: string
}

/** Derived at build time from the actual data — see lib/meals.ts. Never
 * hardcode a category list by hand; it WILL drift from the JSON. */
export type Category = string
