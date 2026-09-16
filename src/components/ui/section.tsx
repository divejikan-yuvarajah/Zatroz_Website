import type { ComponentProps, ElementType } from "react";
import { cn } from "@/lib/cn";

export type SectionSurface = "light" | "muted" | "dark";

const surfaceClass: Record<SectionSurface, string> = {
  light: "bg-canvas text-text-body",
  muted: "bg-surface-muted text-text-body",
  dark: "bg-ink text-text-inverse-body [&_h1]:text-text-inverse [&_h2]:text-text-inverse [&_h3]:text-text-inverse",
};

export type SectionProps = {
  as?: "section" | "div";
  surface?: SectionSurface;
} & ComponentProps<"section">;

/**
 * Full-bleed surface and vertical rhythm. Put Container inside for gutters.
 * Use `as="section"` only with an accessible heading. Use `div` for visual grouping.
 */
export function Section({
  as = "section",
  surface = "light",
  className,
  ...props
}: SectionProps) {
  const Tag = as as ElementType;

  return (
    <Tag
      {...props}
      className={cn("py-section", surfaceClass[surface], className)}
    />
  );
}
