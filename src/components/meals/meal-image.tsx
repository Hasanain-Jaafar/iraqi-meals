"use client"
import Image from "next/image"
import { useState } from "react"
import { ImageOff } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Wraps next/image with a graceful fallback. Local meal photos are dropped
 * into /public/images/meals/<slug>.jpg by the site owner (see CLAUDE.md §3)
 * — at any point before that file exists, next/image would otherwise throw
 * a build-time/runtime error. This shows a calm placeholder instead, NEVER
 * a broken-image icon, so the grid still looks intentional pre-launch.
 */
export function MealImage({
  src,
  alt,
  fill = true,
  sizes,
  priority = false,
  className,
}: {
  src: string
  alt: string
  fill?: boolean
  sizes?: string
  priority?: boolean
  className?: string
}) {
  const [errored, setErrored] = useState(false)

  if (errored) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 bg-secondary text-muted-foreground",
          className
        )}
      >
        <ImageOff size={28} strokeWidth={1.75} />
        <span className="text-xs">صورة</span>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
      onError={() => setErrored(true)}
    />
  )
}
