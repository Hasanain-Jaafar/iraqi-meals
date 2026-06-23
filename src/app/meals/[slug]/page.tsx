import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Clock, Users, ChefHat } from "lucide-react"
import { getMealBySlug, getAllSlugs } from "@/lib/meals"
import { MealImage } from "@/components/meals/meal-image"
import { FavoriteButton } from "@/components/meals/favorite-button"
import { AddToFavoriteButton } from "@/components/meals/add-to-favorite-button"
import { Badge } from "@/components/ui/badge"
import { BackgroundBlobs } from "@/components/layout/background-blobs"
import type { Metadata } from "next"

/**
 * REQUIRED for `output: "export"` (static export). Without this, Next.js
 * cannot know which /meals/[slug] pages to pre-render at build time and
 * `next build` fails for any dynamic route. Every slug in the dataset gets
 * its own static HTML file in /out — there is no server-side fallback in
 * static export, so a slug NOT returned here will 404 in production even
 * if it exists in meals.json.
 */
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const meal = getMealBySlug(slug)
  if (!meal) return {}
  return {
    title: `${meal.name} — مطبخنا`,
    description: `طريقة تحضير ${meal.name}: ${meal.ingredients.length} مكوّنات، ${meal.timeOfCook}.`,
  }
}

export default async function MealDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const meal = getMealBySlug(slug)
  if (!meal) notFound()

  return (
    <>
      <BackgroundBlobs />
      <main className="relative z-10 flex-1 pb-28 max-w-md mx-auto w-full">
        <div className="relative aspect-square w-full bg-secondary">
          <MealImage src={meal.image} alt={meal.name} priority />
          <Link
            href="/meals"
            aria-label="رجوع"
            className="absolute top-5 start-5 glass-card rounded-full p-2.5"
          >
            <ArrowRight size={20} strokeWidth={1.75} />
          </Link>
          <FavoriteButton slug={meal.slug} className="absolute top-5 end-5" />
        </div>

        <div className="relative -mt-6 rounded-t-3xl bg-background px-5 pt-6 space-y-6">
          <header className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">{meal.name}</h1>
            <Badge variant="accent">{meal.category}</Badge>
          </header>

          <div className="grid grid-cols-3 gap-2">
            <StatCard icon={ChefHat} label="مستوى" value="سهل" />
            <StatCard icon={Users} label="تكفي لـ" value={meal.portion} />
            <StatCard icon={Clock} label="وقت الطبخ" value={meal.timeOfCook} />
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">المكوّنات</h2>
            <ul className="space-y-2">
              {meal.ingredients.map((ingredient, i) => (
                <li
                  key={i}
                  className="flex items-center justify-start gap-2 glass-card rounded-2xl px-4 py-3 text-sm"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: "var(--accent-color)" }}
                    aria-hidden="true"
                  />
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">طريقة التحضير</h2>
            <ol className="space-y-3">
              {meal.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    className="flex items-center justify-center h-7 w-7 rounded-full text-xs font-semibold shrink-0 ltr-numerals"
                    style={{
                      backgroundColor: "var(--accent-color-15)",
                      color: "var(--accent-color)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed pt-0.5">
                    {renderStepText(step, meal.slug)}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <AddToFavoriteButton slug={meal.slug} />
        </div>
      </main>
    </>
  )
}

function renderStepText(step: string, slug: string) {
  if (slug !== "meal-17" || !step.includes("كبيرين")) return step

  const [before, after] = step.split("كبيرين")
  return (
    <>
      {before}
      <a href="https://getlovertogether.netlify.app/" className="text-inherit no-underline">
        كبيرين
      </a>
      {after}
    </>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ChefHat
  label: string
  value: string
}) {
  return (
    <div className="glass-card rounded-2xl flex flex-col items-center justify-center gap-1.5 py-4 text-center">
      <Icon size={20} strokeWidth={1.75} className="text-[var(--accent-color)]" />
      <span className="text-sm font-semibold ltr-numerals">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
