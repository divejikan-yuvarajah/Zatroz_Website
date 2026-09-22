import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "quiet";
export type ButtonSize = "normal" | "compact";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-ink hover:bg-brand-hover disabled:bg-brand disabled:text-ink",
  secondary:
    "bg-surface text-ink ring-1 ring-inset ring-border-control hover:bg-surface-muted disabled:bg-surface",
  quiet:
    "bg-transparent text-ink hover:bg-surface-muted disabled:bg-transparent",
};

const sizeClass: Record<ButtonSize, string> = {
  normal: "min-h-11 px-5 py-3 text-base",
  compact: "min-h-11 px-3 py-2 text-sm",
};

const baseClass =
  "ds-pressable inline-flex max-w-full items-center justify-center gap-2 rounded-sm font-medium text-center break-words disabled:cursor-not-allowed disabled:opacity-60";

export function buttonClassName({
  variant = "primary",
  size = "normal",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}): string {
  return cn(baseClass, variantClass[variant], sizeClass[size], className);
}
