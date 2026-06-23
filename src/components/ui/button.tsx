import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Two-tier color rule (design.md §7.2):
 * - "primary": near-black commit action (Save/Add/Submit/تأكيد) — NOT accent.
 * - "accent": the user-configurable brand accent — for recurring small CTAs,
 *   nav/selection state. Never use accent for a data-commit action.
 * - "outline"/"ghost"/"secondary": standard neutral variants.
 * - "destructive": fixed red, never themed.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-[#1d1d1f] text-white hover:bg-[#1d1d1f]/90",
        accent:
          "bg-[var(--accent-color)] text-[var(--accent-foreground)] hover:bg-[var(--accent-color)]/90",
        outline: "border border-border bg-transparent hover:bg-secondary",
        ghost: "bg-transparent hover:bg-secondary",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
      },
      size: {
        default: "h-11 px-5 has-[>svg]:px-4",
        sm: "h-9 px-4 text-sm has-[>svg]:px-3",
        lg: "h-12 px-6 text-base has-[>svg]:px-5",
        icon: "h-10 w-10 shrink-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
