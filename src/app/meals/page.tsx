import { Suspense } from "react"
import { getAllMeals, getAllCategories } from "@/lib/meals"
import { MealsBrowser } from "@/components/meals/meals-browser"
import { BottomNav } from "@/components/layout/bottom-nav"
import { BackgroundBlobs } from "@/components/layout/background-blobs"

export default function MealsPage() {
  const meals = getAllMeals()
  const categories = getAllCategories()

  return (
    <>
      <BackgroundBlobs />
      <main className="relative z-10 flex-1 px-5 pt-8 pb-28 max-w-md mx-auto w-full space-y-5">
        <header className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">كل الأكلات</h1>
          <p className="text-sm text-muted-foreground ltr-numerals-inline">
            {meals.length} وصفة بيتية مرتّبة حسب الصنف
          </p>
        </header>

        {/* useSearchParams requires a Suspense boundary in App Router —
            without it, `next build` throws at build time for static export. */}
        <Suspense fallback={null}>
          <MealsBrowser meals={meals} categories={categories} />
        </Suspense>
      </main>
      <BottomNav />
    </>
  )
}
