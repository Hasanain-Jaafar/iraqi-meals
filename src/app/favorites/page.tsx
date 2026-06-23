import { getAllMeals } from "@/lib/meals"
import { FavoritesBrowser } from "@/components/meals/favorites-browser"
import { BottomNav } from "@/components/layout/bottom-nav"
import { BackgroundBlobs } from "@/components/layout/background-blobs"

export default function FavoritesPage() {
  const meals = getAllMeals()

  return (
    <>
      <BackgroundBlobs />
      <main className="relative z-10 flex-1 px-5 pt-8 pb-28 max-w-md mx-auto w-full space-y-5">
        <header className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">المفضلة</h1>
          <p className="text-sm text-muted-foreground">
            الأكلات التي حفظتها لتجدها بسهولة
          </p>
        </header>

        <FavoritesBrowser meals={meals} />
      </main>
      <BottomNav />
    </>
  )
}
