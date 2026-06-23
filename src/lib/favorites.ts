import { useCallback, useSyncExternalStore } from "react"

const STORAGE_KEY = "favorite_slugs"
export const FAVORITES_CHANGE_EVENT = "favorites-change"

// useSyncExternalStore requires getSnapshot to return a referentially
// stable value when the underlying data hasn't changed, or it loops
// infinitely re-rendering. Cache the parsed array keyed on the raw
// localStorage string so repeated calls between actual changes return
// the same array reference.
const EMPTY_SLUGS: string[] = []
let cachedRaw: string | null = null
let cachedSlugs: string[] = EMPTY_SLUGS

export function getFavoriteSlugs(): string[] {
  if (typeof window === "undefined") return cachedSlugs
  let raw: string | null
  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch {
    raw = null
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw
    try {
      cachedSlugs = raw ? (JSON.parse(raw) as string[]) : EMPTY_SLUGS
    } catch {
      cachedSlugs = EMPTY_SLUGS
    }
  }
  return cachedSlugs
}

export function isFavorite(slug: string): boolean {
  return getFavoriteSlugs().includes(slug)
}

export function toggleFavorite(slug: string): void {
  if (typeof window === "undefined") return
  const current = getFavoriteSlugs()
  const next = current.includes(slug)
    ? current.filter((s) => s !== slug)
    : [...current, slug]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event(FAVORITES_CHANGE_EVENT))
}

function subscribe(callback: () => void) {
  const storageHandler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback()
  }
  window.addEventListener("storage", storageHandler)
  window.addEventListener(FAVORITES_CHANGE_EVENT, callback)
  return () => {
    window.removeEventListener("storage", storageHandler)
    window.removeEventListener(FAVORITES_CHANGE_EVENT, callback)
  }
}

/** Reactive read of favorited slugs — re-renders on toggle, in any
 * mounted component, without a context provider. SSR snapshot is empty
 * (no localStorage on the server), matching the static-export reality
 * that favorites are a client-only, per-browser concept. */
export function useFavoriteSlugs(): string[] {
  return useSyncExternalStore(subscribe, getFavoriteSlugs, () => EMPTY_SLUGS)
}

export function useIsFavorite(slug: string): boolean {
  const slugs = useFavoriteSlugs()
  return slugs.includes(slug)
}

export function useToggleFavorite(): (slug: string) => void {
  return useCallback((slug: string) => toggleFavorite(slug), [])
}
