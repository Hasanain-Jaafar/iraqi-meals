/**
 * Gives the glass surfaces something to refract — see design.md §4.1.
 * `fixed` (not `absolute`) so blobs stay anchored to the viewport while the
 * page scrolls. Render once near the root of each page, behind a
 * `relative z-10` content wrapper.
 */
export function BackgroundBlobs() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-10 -right-10 h-72 w-72 rounded-full bg-[var(--accent-color)]/25 blur-3xl z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-32 left-0 h-80 w-80 rounded-full bg-[#0066cc]/15 blur-3xl z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 right-1/3 h-72 w-72 rounded-full bg-[#ff9500]/12 blur-3xl z-0"
      />
    </>
  )
}
