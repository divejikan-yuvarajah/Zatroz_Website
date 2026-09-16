import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant =
  "neutral" | "accent" | "success" | "warning" | "error";

const variantClass: Record<BadgeVariant, string> = {
  neutral: "bg-surface-muted text-ink",
  accent: "bg-brand-soft text-brand-strong",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  error: "bg-error-soft text-error",
};

export type BadgeProps = {
  variant?: BadgeVariant;
} & ComponentProps<"span">;

export function Badge({
  variant = "neutral",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={cn(
        "inline-flex max-w-full break-words rounded-sm px-2 py-1 text-sm font-medium",
        variantClass[variant],
        className,
      )}
    />
  );
}
