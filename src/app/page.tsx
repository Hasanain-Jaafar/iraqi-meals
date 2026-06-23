import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getAllMeals, getAllCategories } from "@/lib/meals"
import { MealCard } from "@/components/meals/meal-card"
import { BottomNav } from "@/components/layout/bottom-nav"
import { BackgroundBlobs } from "@/components/layout/background-blobs"
import { MealImage } from "@/components/meals/meal-image"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const meals = getAllMeals()
  const categories = getAllCategories()
  const featured = meals.slice(0, 4)
  const hero = meals.find((m) => m.slug === "meal-20") ?? meals[0]

  return (
    <>
      <BackgroundBlobs />
      <main className="relative z-10 flex-1 px-5 pt-8 pb-28 max-w-md mx-auto w-full space-y-8">
        <header className="space-y-1">
          <p className="text-sm text-muted-foreground">مساء الخير</p>
          <h1 className="text-3xl font-semibold tracking-tight">مطبخنا</h1>
        </header>

        {hero && (
          <Link
            href={`/meals/${hero.slug}`}
            className="relative block aspect-[4/3] w-full rounded-xl overflow-hidden glass-card"
          >
            <MealImage src={hero.image} alt={hero.name} priority />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5 pt-12">
              <h2 className="text-white text-xl font-semibold">
                أكلات بيتيّة تجمع العائلة
              </h2>
              <p className="text-white/80 text-sm mt-1">
                وصفات بسيطة بنكهة البيت الأصيلة
              </p>
            </div>
          </Link>
        )}

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">تصفّح حسب الصنف</h2>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-none">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/meals?category=${encodeURIComponent(cat)}`}
                className="glass-card rounded-2xl px-4 py-2 text-sm whitespace-nowrap shrink-0"
              >
                {cat}
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">أطباق مميّزة</h2>
          <div className="grid grid-cols-2 gap-3">
            {featured.map((meal, i) => (
              <MealCard key={meal.slug} meal={meal} priority={i < 2} />
            ))}
          </div>
        </section>

        <Button asChild variant="accent" size="lg" className="w-full">
          <Link href="/meals">
            تصفّح كل الأكلات
            <ArrowLeft size={18} strokeWidth={1.75} />
          </Link>
        </Button>
      </main>
      <BottomNav />
    </>
  )
}
