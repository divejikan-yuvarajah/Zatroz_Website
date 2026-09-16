import { cn } from "@/lib/cn";

export function textControlClassName({
  invalid = false,
  readOnly = false,
  className,
}: {
  invalid?: boolean;
  readOnly?: boolean;
  className?: string;
}): string {
  return cn(
    "ds-transition w-full min-w-0 max-w-full rounded-sm border bg-surface px-3 py-2 text-base text-text-body",
    "min-h-11",
    invalid ? "border-error" : "border-border-control",
    readOnly && "bg-surface-muted",
    "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60",
    className,
  );
}

export function selectControlClassName({
  invalid = false,
  className,
}: {
  invalid?: boolean;
  className?: string;
}): string {
  return textControlClassName({ invalid, className });
}
