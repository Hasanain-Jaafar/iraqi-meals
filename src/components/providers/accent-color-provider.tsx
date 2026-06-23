"use client"
import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import {
  DEFAULT_ACCENT_COLOR,
  getAccentColor,
  storeAccentColor,
  applyAccentColor,
} from "@/lib/accent-color"

const AccentColorContext = createContext({
  accentColor: DEFAULT_ACCENT_COLOR,
  setAccentColor: (_color: string) => {},
})

function subscribe(callback: () => void) {
  const storageHandler = (e: StorageEvent) => {
    if (e.key === "accent_color") callback()
  }
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
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const accentColor = useSyncExternalStore(
    subscribe,
    getAccentColor,
    () => DEFAULT_ACCENT_COLOR
  )

  useEffect(() => {
    if (mounted) applyAccentColor(accentColor)
  }, [accentColor, mounted])

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
