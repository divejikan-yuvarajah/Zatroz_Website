import { cn } from "@/lib/cn";

export type NavVisualState = "idle" | "current" | "section";

export function navLinkClassName(state: NavVisualState): string {
  return cn(
    "ds-transition inline-flex min-h-11 max-w-full items-center rounded-sm px-2 py-2 text-base font-medium break-words",
    state === "current" && "text-ink underline decoration-2 underline-offset-4",
    state === "section" && "text-ink ring-1 ring-inset ring-border-control",
    state === "idle" && "text-ink hover:text-brand-strong",
  );
}

export function plannedNavClassName(): string {
  return "inline-flex min-h-11 max-w-full items-center px-2 py-2 text-base text-text-muted break-words";
}
