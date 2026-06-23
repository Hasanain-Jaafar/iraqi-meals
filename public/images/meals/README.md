# /public/images/meals

Drop meal photos here, named exactly `<slug>.jpg` to match `src/data/meals.json`.

Slugs are `meal-01.jpg` through `meal-27.jpg` (run `npm run data:transform`
again after editing the raw JSON to regenerate slugs/count if meals are
added or removed).

Until a file exists for a given slug, the `<MealImage>` component
(`src/components/meals/meal-image.tsx`) shows a calm placeholder instead of
a broken image — so it's safe to deploy before every photo is in place.

Recommended source size: at least 1200×900px, compressed (.jpg, quality
~75-80) before adding — `next/image` optimization is disabled in this
project's static-export build (see next.config.ts), so whatever you put
here ships byte-for-byte to production.
