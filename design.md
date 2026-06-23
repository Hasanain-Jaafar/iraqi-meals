# Design System — "Apple-Calm Glass"

A portable design spec extracted from this project. Copy the code blocks
directly into a new project to reproduce the same visual language: an
Apple-HIG-inspired, light, airy interface with frosted-glass surfaces and a
single user-configurable accent color.

Stack assumptions: Tailwind CSS v4 (CSS-first config via `@theme`), React,
`class-variance-authority`, `tailwind-merge`, `lucide-react` icons,
`framer-motion` for motion, `radix-ui` primitives (shadcn/ui style). The
principles apply even if you swap any of these out — only the exact
class-name recipes assume this stack.

---

## 1. Philosophy

- **Calm over loud.** Default surfaces are white/light-gray glass, near-black
  text (`#1d1d1f`), and gray secondary text. Color is reserved for one thing:
  the accent, plus a small fixed set of system semantic colors (success,
  warning, destructive). Nothing else gets a custom color.
- **One configurable accent, used consistently.** The product has exactly one
  brand color, and the user can change it. Every "this is the important
  action / current state / primary metric" moment in the UI uses
  `var(--accent-color)` — never a hardcoded hex that happens to match the
  default accent. (This was the single most common bug found when auditing
  this codebase: old hardcoded `#f5c542` yellow values left behind after the
  accent became user-configurable. Search for hex literals before shipping.)
- **Depth via blur, not borders.** Cards are translucent and blurred
  ("glassmorphism") rather than flat-white-with-a-border. Depth comes from
  frosted layering over soft color blobs, not from heavy shadows or hard
  outlines.
- **Generous, consistent rounding.** Corners are large and consistent by
  element tier (see §4). Nothing is sharp-cornered except rare full-bleed
  containers.
- **Restraint in motion.** Animations are short (150–600ms), use `easeOut`,
  and exist to confirm state changes (entrance, completion, hover) — never to
  delay or decorate.
- **Reversibility.** Destructive actions (delete) and exploratory actions
  (apply a "what if" scenario) should be undoable via a toast action, not a
  confirmation dialog. Don't block the user; let them undo.

---

## 2. Color system

### 2.1 CSS variables (light + dark)

Drop this into your global stylesheet. It defines the full semantic palette
Tailwind's `@theme inline` maps onto (`bg-card`, `text-foreground`, etc. all
resolve through these).

```css
:root {
  /* Canvas */
  --background: #f5f5f7;
  --foreground: #1d1d1f;

  /* Surfaces */
  --card: #ffffff;
  --card-foreground: #1d1d1f;
  --popover: rgba(255, 255, 255, 0.82);
  --popover-foreground: #1d1d1f;

  /* Apple Action Blue — used for links/focus rings, NOT the brand accent */
  --primary: #0066cc;
  --primary-foreground: #ffffff;

  /* Secondary / muted */
  --secondary: #f5f5f7;
  --secondary-foreground: #1d1d1f;
  --muted: #f5f5f7;
  --muted-foreground: #6e6e73;
  --accent: #f5f5f7;
  --accent-foreground: #1d1d1f;

  /* Borders & rings */
  --border: rgba(0, 0, 0, 0.08);
  --input: rgba(0, 0, 0, 0.08);
  --ring: #0066cc;

  /* Semantic */
  --destructive: #ff3b30;
  --radius: 0.75rem;

  /* Data viz */
  --chart-1: #0066cc;
  --chart-2: #34c759;
  --chart-3: #ff9500;
  --chart-4: #af52de;
  --chart-5: #ff2d55;

  /* Sidebar (separate token group so a sidebar can diverge from page bg) */
  --sidebar: rgba(255, 255, 255, 0.72);
  --sidebar-foreground: #1d1d1f;
  --sidebar-primary: #0066cc;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: #f5f5f7;
  --sidebar-accent-foreground: #1d1d1f;
  --sidebar-border: rgba(0, 0, 0, 0.08);
  --sidebar-ring: #0066cc;

  /* User-configurable brand accent — see §3 */
  --accent-color: #e8b92f;
  --accent-foreground: #1d1d1f;
  --accent-color-10: rgba(232, 185, 47, 0.1);
  --accent-color-15: rgba(232, 185, 47, 0.15);
  --accent-color-20: rgba(232, 185, 47, 0.2);
  --accent-color-30: rgba(232, 185, 47, 0.3);
  --accent-color-50: rgba(232, 185, 47, 0.5);
  --accent-color-80: rgba(232, 185, 47, 0.8);
}

.dark {
  --background: #000000;
  --foreground: #f5f5f7;
  --card: rgba(29, 29, 31, 0.72);
  --card-foreground: #f5f5f7;
  --popover: rgba(29, 29, 31, 0.82);
  --popover-foreground: #f5f5f7;
  --primary: #0066cc;
  --primary-foreground: #ffffff;
  --secondary: rgba(255, 255, 255, 0.1);
  --secondary-foreground: #f5f5f7;
  --muted: rgba(255, 255, 255, 0.1);
  --muted-foreground: #a1a1a6;
  --accent: rgba(255, 255, 255, 0.1);
  --accent-foreground: #f5f5f7;
  --border: rgba(255, 255, 255, 0.12);
  --input: rgba(255, 255, 255, 0.16);
  --ring: #0066cc;
  --destructive: #ff453a;
  --chart-1: #0a84ff;
  --chart-2: #30d158;
  --chart-3: #ff9f0a;
  --chart-4: #bf5af2;
  --chart-5: #ff375f;
  --sidebar: rgba(29, 29, 31, 0.72);
  --sidebar-foreground: #f5f5f7;
  --sidebar-primary: #0066cc;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: rgba(255, 255, 255, 0.1);
  --sidebar-accent-foreground: #f5f5f7;
  --sidebar-border: rgba(255, 255, 255, 0.12);
  --sidebar-ring: #0066cc;
}
```

### 2.2 Semantic colors (fixed, not theme-able)

Use these exact hexes everywhere a status needs color. Don't invent new
status colors.

| Meaning | Light | Dark | Used for |
|---|---|---|---|
| Success | `#34c759` | `#30d158` | positive deltas, "saved enough", completed states |
| Caution | `#ff9500` | `#ff9f0a` | "behind schedule", over-budget-but-not-error |
| Destructive / error | `#ff3b30` | `#ff453a` | overspending, delete actions, real errors |
| Primary text | `#1d1d1f` | `#f5f5f7` | headings, primary values |
| Secondary text | `#6e6e73` or `#8a8a8a` | `#a1a1a6` | captions, helper text, timestamps |

**Rule:** an *empty* or *neutral* state (e.g. "no data yet") must never use
the destructive color. Red means something is actually wrong, not "you
haven't filled this in yet."

### 2.3 The accent color is sacred — and dynamic

Never hardcode the accent's hex anywhere in component code. Always reference
`var(--accent-color)` (or the Tailwind arbitrary-value form
`bg-[var(--accent-color)]`, `text-[var(--accent-color)]`,
`border-l-[var(--accent-color)]`). The whole point of §3 is that this value
changes at runtime per-user — any hardcoded hex that happens to match today's
default will silently desync the moment the user picks a different color.

---

## 3. User-configurable accent color system

This is a complete, drop-in pattern: a small set of preset accent colors,
luminance-based automatic foreground-color selection (so text on the accent
is always readable), persistence to `localStorage`, and a pre-hydration
inline script that prevents a flash of the wrong color on load.

### 3.1 `lib/accent-color.ts`

```ts
export const DEFAULT_ACCENT_COLOR = "#E8B92F"

export const ACCENT_COLORS = [
  { name: "Sun", value: "#E8B92F" },
  { name: "Calm", value: "#0071E3" },
  { name: "Growth", value: "#34C759" },
  { name: "Fire", value: "#FF3B30" },
  { name: "Dream", value: "#AF52DE" },
  { name: "Adventure", value: "#FF9500" },
  { name: "Focus", value: "#5AC8FA" },
  { name: "Bold", value: "#FF2D55" },
]

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace("#", "")
  if (normalized.length !== 3 && normalized.length !== 6) return null
  const full = normalized.length === 3
    ? normalized.split("").map((c) => c + c).join("")
    : normalized
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}

export function hexToRgba(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
}

// WCAG relative-luminance check picks black or white text automatically
// so any accent color stays readable without manual per-color tuning.
export function getAccentForeground(hex: string): "#ffffff" | "#1d1d1f" {
  const rgb = hexToRgb(hex)
  if (!rgb) return "#1d1d1f"
  const toLinear = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  const luminance =
    0.2126 * toLinear(rgb.r) + 0.7152 * toLinear(rgb.g) + 0.0722 * toLinear(rgb.b)
  return luminance > 0.5 ? "#1d1d1f" : "#ffffff"
}

export function getAccentColor(): string {
  if (typeof window === "undefined") return DEFAULT_ACCENT_COLOR
  return localStorage.getItem("accent_color") || DEFAULT_ACCENT_COLOR
}

export function storeAccentColor(color: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem("accent_color", color)
}

export function applyAccentColor(color: string): void {
  if (typeof window === "undefined") return
  const root = document.documentElement
  const foreground = getAccentForeground(color)
  root.style.setProperty("--accent-color", color)
  root.style.setProperty("--accent-foreground", foreground)
  root.style.setProperty("--accent-color-10", hexToRgba(color, 0.1))
  root.style.setProperty("--accent-color-15", hexToRgba(color, 0.15))
  root.style.setProperty("--accent-color-20", hexToRgba(color, 0.2))
  root.style.setProperty("--accent-color-30", hexToRgba(color, 0.3))
  root.style.setProperty("--accent-color-50", hexToRgba(color, 0.5))
  root.style.setProperty("--accent-color-80", hexToRgba(color, 0.8))
}
```

### 3.2 React provider (`components/providers/accent-color-provider.tsx`)

```tsx
"use client"
import {
  createContext, useContext, useCallback, useEffect,
  useSyncExternalStore, type ReactNode,
} from "react"
import {
  DEFAULT_ACCENT_COLOR, getAccentColor, storeAccentColor, applyAccentColor,
} from "@/lib/accent-color"

const AccentColorContext = createContext({
  accentColor: DEFAULT_ACCENT_COLOR,
  setAccentColor: (_color: string) => {},
})

function subscribe(callback: () => void) {
  const storageHandler = (e: StorageEvent) => { if (e.key === "accent_color") callback() }
  const customHandler = () => callback()
  window.addEventListener("storage", storageHandler)
  window.addEventListener("accent-color-change", customHandler)
  return () => {
    window.removeEventListener("storage", storageHandler)
    window.removeEventListener("accent-color-change", customHandler)
  }
}

export function useAccentColor() {
  return useContext(AccentColorContext)
}

export function AccentColorProvider({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false)
  const accentColor = useSyncExternalStore(subscribe, getAccentColor, () => DEFAULT_ACCENT_COLOR)

  useEffect(() => { if (mounted) applyAccentColor(accentColor) }, [accentColor, mounted])

  const setAccentColor = useCallback((color: string) => {
    applyAccentColor(color)
    storeAccentColor(color)
    window.dispatchEvent(new Event("accent-color-change"))
  }, [])

  return (
    <AccentColorContext.Provider value={{ accentColor, setAccentColor }}>
      {children}
    </AccentColorContext.Provider>
  )
}
```

### 3.3 Pre-hydration script (prevents flash of wrong color on load)

Place this `<Script strategy="beforeInteractive">` (Next.js) — or an inline
`<script>` right before `</head>` for other frameworks — in the root layout,
*before* the provider renders:

```html
<script>
(function() {
  try {
    var DEFAULT = '#E8B92F';
    var color = localStorage.getItem('accent_color') || DEFAULT;
    var r = parseInt(color.slice(1, 3), 16);
    var g = parseInt(color.slice(3, 5), 16);
    var b = parseInt(color.slice(5, 7), 16);
    var toLinear = function (c) {
      var s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    var lum = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
    var foreground = lum > 0.5 ? '#1d1d1f' : '#ffffff';
    var root = document.documentElement;
    root.style.setProperty('--accent-color', color);
    root.style.setProperty('--accent-foreground', foreground);
    root.style.setProperty('--accent-color-10', 'rgba(' + r + ',' + g + ',' + b + ',0.1)');
    root.style.setProperty('--accent-color-15', 'rgba(' + r + ',' + g + ',' + b + ',0.15)');
    root.style.setProperty('--accent-color-20', 'rgba(' + r + ',' + g + ',' + b + ',0.2)');
    root.style.setProperty('--accent-color-30', 'rgba(' + r + ',' + g + ',' + b + ',0.3)');
    root.style.setProperty('--accent-color-50', 'rgba(' + r + ',' + g + ',' + b + ',0.5)');
    root.style.setProperty('--accent-color-80', 'rgba(' + r + ',' + g + ',' + b + ',0.8)');
  } catch (e) {}
})();
</script>
```

### 3.4 An accent color picker (settings UI)

Render `ACCENT_COLORS` as a row of swatches; clicking one calls
`setAccentColor(value)` from the provider. Always pair a color swatch with
its `name` label somewhere in the UI — never show unlabeled color dots as the
only way to identify a selection (applies to any color picker, not just
accent: a category-color picker, a tag-color picker, etc. should also show
names).

---

## 4. Glassmorphism utilities

Two CSS classes provide every "frosted card" surface in the product. They
deliberately avoid the `border` shorthand property — use an **inset
box-shadow** instead — so that components can still freely add
Tailwind border-utilities (`border-l-4`, `border-l-[var(--accent-color)]`,
etc.) for left-accent-bar treatments without the glass class's border
silently overriding them in the cascade.

```css
.glass-card {
  background-color: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(40px) saturate(1.5);
  -webkit-backdrop-filter: blur(40px) saturate(1.5);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.6);
}

.glass-card-dark {
  background-color: rgba(29, 29, 31, 0.7);
  backdrop-filter: blur(40px) saturate(1.5);
  -webkit-backdrop-filter: blur(40px) saturate(1.5);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}
```

**Usage:** `className="glass-card rounded-3xl"` on any card-level container.
For a card that needs a brand-colored personality (e.g. a CTA card) instead
of neutral glass, tint it directly rather than using `.glass-card`:

```
bg-[var(--accent-color)]/55 backdrop-blur-2xl backdrop-saturate-150
border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)]
```

### 4.1 Give the glass something to refract

Frosted glass over a flat, single-color page background looks flat — there's
nothing behind it to blur. Add 2–3 large, soft, fixed-position color blobs
behind the content so every glass surface has visible depth as the user
scrolls:

```tsx
<div className="pointer-events-none fixed -top-10 -left-10 h-72 w-72 rounded-full bg-[var(--accent-color)]/30 blur-3xl z-0" aria-hidden="true" />
<div className="pointer-events-none fixed top-20 right-0 h-80 w-80 rounded-full bg-[#0066cc]/20 blur-3xl z-0" aria-hidden="true" />
<div className="pointer-events-none fixed bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#ff9500]/15 blur-3xl z-0" aria-hidden="true" />
```

Use `fixed` (not `absolute`) positioning so the blobs stay anchored to the
viewport and keep providing color as the user scrolls through a long page.
Wrap actual page content in a `relative z-10` wrapper so it renders above the
blobs.

### 4.2 Contrast caveat

Secondary text color (`#8a8a8a` / `#6e6e73`) was tuned against solid white.
On a 45%-opacity blurred background sitting over colored blobs, contrast
becomes variable — spot-check WCAG AA on any text sitting directly on glass,
especially smaller caption text.

---

## 5. Spacing & radius scale

| Radius token | Tailwind class | Use for |
|---|---|---|
| `--radius` (0.75rem base) | `rounded-lg` | rare, small chips |
| `--radius-xl` | `rounded-xl` | inputs, buttons, small interactive elements |
| `--radius-2xl` | `rounded-2xl` | nested boxes inside cards, tab bars, pills |
| `--radius-3xl` | `rounded-3xl` | **cards** — the default for any top-level Card |
| `rounded-full` | `rounded-full` | avatars, dots, fully-pill buttons/badges |

Radius scale is generated from one base variable so changing `--radius`
rescales everything proportionally:

```css
--radius-sm: calc(var(--radius) * 0.6);
--radius-md: calc(var(--radius) * 0.8);
--radius-lg: var(--radius);
--radius-xl: calc(var(--radius) * 1.4);
--radius-2xl: calc(var(--radius) * 1.8);
--radius-3xl: calc(var(--radius) * 2.2);
--radius-4xl: calc(var(--radius) * 2.6);
```

**Spacing rules:**
- Page-level vertical rhythm: `space-y-8` (desktop), `space-y-5` (a "compact
  density" mode, see §8).
- Grid gaps between cards: `gap-5` (desktop) / `gap-3` (compact).
- Card internal padding: `p-6` (desktop) / `p-3` (compact), or rely on the
  Card component's own `--card-spacing` variable.
- On mobile, multi-stat rows (e.g. 4 KPI chips) must use **CSS grid with
  equal columns** (`grid grid-cols-2`), not `flex flex-wrap` — flex-wrap lets
  each item size to its own content, producing a ragged, misaligned 2×n
  layout once items wrap. Use grid below the breakpoint where it wraps;
  flex-wrap is fine once everything fits on one line.

---

## 6. Typography

```css
--font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display",
  "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
--font-heading: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text",
  "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
```

No custom webfont — lean entirely on the OS system font for an authentic
native feel. `h1`–`h6` get the same stack (SF Pro Display first, for tighter
tracking at large sizes).

| Role | Classes |
|---|---|
| Page title | `text-3xl md:text-4xl font-semibold tracking-tight` |
| Section heading | `text-xl font-semibold` |
| Card title | `text-lg font-semibold` |
| Hero metric (the one big number on a page) | `text-4xl md:text-5xl font-semibold` |
| Standard metric | `text-2xl` to `text-4xl font-semibold` |
| Body / label | default size, `font-medium` for labels |
| Secondary / caption | `text-sm` or `text-xs`, `text-[#6e6e73]` or `text-[#8a8a8a]` |
| Micro / timestamp | `text-[10px]` to `text-xs`, secondary color |

**Rule: lead with the answer.** If a page's job is to tell the user one
important number (a forecast, a total, a result), that number gets the
largest hero treatment and appears *before* the inputs/controls that produce
it — not buried below them. On mobile in particular, where columns stack
vertically, a hero result placed after a long input form means the user
scrolls past everything before seeing any payoff.

---

## 7. Component recipes

### 7.1 Card

```tsx
<div className="glass-card rounded-3xl p-6">
  {/* or with shadcn/ui Card: <Card className="glass-card rounded-3xl"> */}
</div>
```

A Card component (shadcn-style) typically ships its own `bg-card` utility
class baked into its base styles. Because `.glass-card` is a plain (unlayered)
CSS rule and `bg-card` is a Tailwind utility living inside a Tailwind
`@layer`, the CSS Cascade Layers spec means the unlayered `.glass-card` wins
regardless of source order — so simply appending `glass-card` to a Card's
`className` is enough; no need to strip the component's default background
class first.

### 7.2 Buttons — two-tier color rule

This codebase enforces a strict rule that's easy to drift from: **the accent
color is for navigation/selection state and small recurring CTAs; the
primary "commit this data" action (Save, Add, Submit) is near-black, not
accent-colored.**

```
Primary commit action (Save/Add/Submit):
  bg-[#1d1d1f] hover:bg-[#1d1d1f]/90 text-white

Recurring small CTA (e.g. "Manage", "View all", a header-level action):
  bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/90 text-accent-foreground

Tab / segment active state:
  data-[state=active]:bg-[var(--accent-color)] data-[state=active]:text-accent-foreground
```

Audit every "Save X" / "Add X" button in a feature for this rule — it's the
most common inconsistency: one form's submit button ends up accent-colored
while every sibling form's submit button is dark, with no actual reason for
the difference.

### 7.3 Inputs

```
h-12 rounded-xl border-[rgba(0,0,0,0.08)] bg-[#f8f1de]/50
```

(The warm cream tint `#f8f1de` is this project's specific input background —
swap for any subtle off-white tint that's distinct from the page background
but lighter than the card.)

**Always pair an input with a visible `<Label>`.** A `placeholder` alone is
not a label — it disappears once a value exists, and certain composite
inputs (currency inputs that always render a formatted "0") never show their
placeholder at all. This was the single most common usability complaint
found in this codebase: forms with 5+ unlabeled fields relying purely on
placeholder text.

### 7.4 Status pills / chips

```tsx
const variants = {
  default: "glass-card text-[#1d1d1f]",
  dark: "glass-card-dark text-white",
  accent: "bg-[var(--accent-color)]/55 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_8px_32px_rgba(0,0,0,0.08)] text-accent-foreground",
}
```

```tsx
<div className={`flex flex-col rounded-2xl px-5 py-3 ${variants[variant]}`}>
  <span className="opacity-70 text-xs">{label}</span>
  <span className="font-semibold text-lg">{value}</span>
</div>
```

### 7.5 Empty states

```tsx
<div className="flex flex-col items-center justify-center text-center py-12 px-6 glass-card rounded-3xl">
  <div className="w-14 h-14 rounded-2xl bg-[var(--accent-color)]/15 flex items-center justify-center mb-4">
    <Icon size={28} strokeWidth={1.75} className="text-[var(--accent-color)]" />
  </div>
  <h3 className="text-lg font-semibold mb-2">{title}</h3>
  <p className="text-sm text-[#8a8a8a] max-w-sm">{description}</p>
</div>
```

Trigger empty states off a meaningful "does this entity exist" check (e.g.
`!goal`), not off a value that can legitimately be zero/empty
(`monthlyIncome === 0`) — otherwise a user with a genuinely-zero value gets
permanently nagged by onboarding copy.

### 7.6 Progress bar (thin, inline)

```tsx
<div className="h-1.5 bg-[#f8f1de] rounded-full overflow-hidden">
  <div
    className="h-full bg-(--accent-color) rounded-full"
    style={{ width: `${pct}%` }}
  />
</div>
```

Swap the fill color to the destructive red when a tracked value exceeds its
target (e.g. over-budget), otherwise accent.

---

## 8. Density modes

Support a single boolean `compact` prop threaded through every dashboard-style
component, switching:
- vertical rhythm (`space-y-8` → `space-y-5`)
- grid/flex gaps (`gap-5` → `gap-3`)
- card padding (`p-6` → `p-3`)
- font sizes one step down (`text-4xl` → `text-2xl`, `text-sm` → `text-xs`)
- icon sizes (`18` → `16`, `28` → `14`)

This lets a single "compact mode" setting in user preferences re-render the
entire dashboard tighter without maintaining two parallel component trees.

---

## 9. Motion (framer-motion)

```tsx
// List item entrance
<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} />

// Staggered entrance
transition={{ delay: index * 0.05 }}

// Success/funded confirmation
<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} />

// Collapsible label (sidebar collapse, etc.)
<AnimatePresence mode="wait" initial={false}>
  {!collapsed && (
    <motion.span
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.15 }}
    />
  )}
</AnimatePresence>
```

Durations: micro-interactions 150–250ms, entrance animations 400–600ms,
`ease: "easeOut"` almost everywhere. Avoid anything longer than 600ms for UI
chrome — reserve longer/springier motion (`type: "spring"`) for a single
celebratory moment (e.g. a checkbox completing a milestone), not for routine
chrome.

---

## 10. Iconography

`lucide-react`, consistently at `strokeWidth={1.75}` (never the default 2 —
1.75 reads lighter/more refined at small sizes). Sizes: `14`–`16` for inline
icons next to text, `18`–`20` for section-header icons, `28`–`32` for
empty-state / hero icons.

---

## 11. Hard rules (lessons from auditing this codebase)

These are bugs that recurred multiple times across this project and are
worth actively grepping for in any project using this system:

1. **Grep for hardcoded accent hexes** (`#f5c542`, `#3B82F6`, or whatever
   today's default accent is) before shipping. Any hit outside
   `lib/accent-color.ts` is a bug — replace with `var(--accent-color)`.
2. **Grep for `CurrencyInput`/numeric-input placeholders.** If an input
   component always renders a formatted value (even "0") instead of an empty
   string, its `placeholder` prop is dead code — it will never be visible.
   Use a real `<Label>` instead.
3. **Never use `border` shorthand inside a glass utility class** — it will
   silently override any `border-l-*` accent-bar utility a consumer adds
   later, because both target overlapping longhand properties. Use inset
   `box-shadow` for the glass "edge" instead.
4. **Pluralize relative time strings** ("1 hour ago", not "1 hours ago") —
   trivial but shows up in literally every "last updated" timestamp if
   missed.
5. **Don't compute the same derived metric two different ways in two
   components on the same screen.** ("Net" = income − expenses in one
   widget, income − expenses − obligations in another, both visible
   simultaneously.) Centralize the calculation once and pass it down.
6. **Destructive actions get an undo toast, not (only) a confirmation
   dialog.** Optimistically remove the item from the UI, schedule the actual
   delete after a 5-second grace window, and offer "Undo" in the toast. If
   the component unmounts before the grace window ends, perform the delete
   immediately (don't silently cancel an action the user already confirmed).
