import type { ComponentProps, ElementType } from "react";
import { cn } from "@/lib/cn";

export type CardProps = {
  as?: "div" | "article";
  padding?: "md" | "lg";
  bordered?: boolean;
} & ComponentProps<"div">;

export function Card({
  as = "div",
  padding = "md",
  bordered = true,
  className,
  ...props
}: CardProps) {
  const Tag = as as ElementType;

  return (
    <Tag
      {...props}
      className={cn(
        "min-w-0 bg-surface text-text-body",
        padding === "lg" ? "p-8" : "p-6",
        bordered && "rounded-md border border-border-subtle shadow-soft",
        !bordered && "rounded-md",
        className,
      )}
    />
  );
}
