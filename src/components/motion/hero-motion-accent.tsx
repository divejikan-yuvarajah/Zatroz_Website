import { cn } from "@/lib/cn";

/**
 * Decorative hero accent. CSS-driven; aria-hidden; never gates LCP copy.
 */
export function HeroMotionAccent({ className }: { className?: string }) {
  return (
    <span className={cn("hero-motion-accent", className)} aria-hidden="true" />
  );
}
