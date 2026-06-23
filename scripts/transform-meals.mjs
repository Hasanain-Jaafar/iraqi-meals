/**
 * scripts/transform-meals.mjs
 *
 * One-time / re-runnable transform: src/data/iraqi_meals.raw.json (the
 * original scraped shape, Arabic keys, external imgUrl) -> src/data/meals.json
 * (the clean shape the app actually imports).
 *
 * Run with: npm run data:transform
 *
 * What it does:
 *  1. Generates a stable slug per meal (for /meals/[slug] routing) from the
 *     Arabic name, transliteration-free — uses index + a sanitized fallback
 *     so slugs are guaranteed unique and URL-safe even with no Latin chars.
 *  2. Rewrites `imgUrl` (external cpcdn.com link) -> a local path
 *     `/images/meals/<slug>.jpg`. This script does NOT download images —
 *     per project decision, images are supplied manually by the site owner
 *     into /public/images/meals/<slug>.jpg. This step only standardizes the
 *     *path* so components never reference an external URL.
 *  3. Normalizes field names from the awkward raw shape ("meal name",
 *     "methodofcook") into clean camelCase TypeScript-friendly keys.
 *  4. Splits the single `methodofcook` paragraph into a numbered steps array
 *     by sentence-ending punctuation, since the UI (see design template,
 *     screen 3) expects a structured ingredients/steps layout, not a wall of
 *     text.
 *  5. Trims stray leading/trailing whitespace on `category` (a raw-data
 *     scraping artifact that otherwise makes the same category look like
 *     two distinct ones) but otherwise leaves it verbatim — see CLAUDE.md
 *     §3 Data Layer for why we do NOT force-map these into 4 groups.
 *  6. Defaults a bare "غير محدد" (not specified) `timeOfCook` to 30 minutes,
 *     then abbreviates unit words per project decision: دقيقة -> د, ساعة -> س
 *     (e.g. "30 دقيقة" -> "30 د").
 */
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const RAW_PATH = path.join(__dirname, "../src/data/iraqi_meals.raw.json")
const OUT_PATH = path.join(__dirname, "../src/data/meals.json")

/** Arabic-safe slugifier: digits/index based, since transliterating Arabic
 *  to Latin loses information and round-trips badly. Using a zero-padded
 *  index keeps slugs short, stable across re-runs (input order doesn't
 *  change), and trivially unique. */
function slugify(index) {
  return `meal-${String(index + 1).padStart(2, "0")}`
}

/** Abbreviates the cook-time unit words to single letters per project
 *  decision: دقيقة -> د, ساعة -> س. Word-boundary substring replace is safe
 *  here — "ساعتين" (two hours) doesn't contain "ساعة" as a substring (the
 *  tاء marbuta vs tاء difference), so it's left untouched, and there's no
 *  plural "دقائق" in this dataset to worry about. */
function abbreviateTime(text) {
  return text.replace(/ساعة/g, "س").replace(/دقيقة/g, "د")
}

/** Defaults bare "غير محدد" (not specified) to 30 minutes per project
 *  decision. Only the exact sentinel value, not variants with extra
 *  parenthetical context (e.g. "غير محدد (حوالي ساعة طبخ)") — those already
 *  carry real info despite the prefix, so they're left alone. */
function defaultUnsetTime(text) {
  return text === "غير محدد" ? "30 دقيقة" : text
}

/** Splits a single run-on Arabic instructions paragraph into discrete steps.
 *  Arabic sentence-final punctuation is just ".", "؟", "!" same as Latin
 *  scripts, so this is a plain split — no special Arabic NLP needed. */
function splitSteps(paragraph) {
  return paragraph
    .split(/(?<=[.؟!])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function main() {
  const raw = JSON.parse(readFileSync(RAW_PATH, "utf-8"))

  const meals = raw.map((item, index) => {
    const slug = slugify(index)
    return {
      slug,
      name: item["meal name"],
      category: item.category.trim(),
      ingredients: item.ingredient,
      steps: splitSteps(item.methodofcook),
      timeOfCook: abbreviateTime(defaultUnsetTime(item.timeOfCook)),
      portion: item.portion,
      // Local path convention — file does not need to exist yet at
      // transform-time; the <MealImage> component (see CLAUDE.md §6)
      // renders a graceful placeholder if it 404s.
      image: `/images/meals/${slug}.jpg`,
    }
  })

  // Fail loudly on duplicate slugs rather than silently shipping broken
  // routes — this should be mathematically impossible given the index-based
  // scheme above, but a future edit to slugify() could reintroduce it.
  const seen = new Set()
  for (const m of meals) {
    if (seen.has(m.slug)) {
      throw new Error(`Duplicate slug detected: ${m.slug} (${m.name})`)
    }
    seen.add(m.slug)
  }

  writeFileSync(OUT_PATH, JSON.stringify(meals, null, 2), "utf-8")
  console.log(`✓ Transformed ${meals.length} meals -> ${path.relative(process.cwd(), OUT_PATH)}`)

  const categories = [...new Set(meals.map((m) => m.category))]
  console.log(`✓ ${categories.length} distinct categories found:`)
  categories.forEach((c) => console.log(`  - ${c}`))
}

main()
