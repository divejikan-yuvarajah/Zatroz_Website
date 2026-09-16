import type { ComponentProps, ElementType } from "react";
import { cn } from "@/lib/cn";

export type HeadingLevel = 1 | 2 | 3;

const tagByLevel: Record<HeadingLevel, "h1" | "h2" | "h3"> = {
  1: "h1",
  2: "h2",
  3: "h3",
};

const visualClass: Record<HeadingLevel, string> = {
  1: "ds-h1",
  2: "ds-h2",
  3: "ds-h3",
};

export type SectionHeadingProps = {
  level: HeadingLevel;
  visualLevel?: HeadingLevel;
  eyebrow?: string;
  description?: string;
  tone?: "light" | "inverse";
} & Omit<ComponentProps<"h2">, "color">;

export function SectionHeading({
  level,
  visualLevel,
  eyebrow,
  description,
  tone = "light",
  id,
  className,
  children,
  ...props
}: SectionHeadingProps) {
  const Tag = tagByLevel[level] as ElementType;
  const visual = visualLevel ?? level;
  const trimmedEyebrow = eyebrow?.trim();
  const trimmedDescription = description?.trim();

  return (
    <div className="min-w-0 max-w-reading">
      {trimmedEyebrow ? (
        <p
          className="ds-support mb-2 font-medium"
          style={
            tone === "inverse"
              ? { color: "var(--text-inverse-muted)" }
              : undefined
          }
        >
          {trimmedEyebrow}
        </p>
      ) : null}
      <Tag
        {...props}
        id={id}
        className={cn("m-0 break-words", visualClass[visual], className)}
        style={
          tone === "inverse" ? { color: "var(--text-inverse)" } : undefined
        }
      >
        {children}
      </Tag>
      {trimmedDescription ? (
        <p
          className={cn(
            "mt-3",
            tone === "inverse" ? "text-text-inverse-body" : "text-text-body",
          )}
        >
          {trimmedDescription}
        </p>
      ) : null}
    </div>
  );
}
