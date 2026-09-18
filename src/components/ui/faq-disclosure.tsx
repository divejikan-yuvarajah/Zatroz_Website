import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type FaqDisclosureProps = {
  id: string;
  question: string;
  children: ReactNode;
  className?: string;
};

/**
 * Native details/summary FAQ row. Works without JavaScript; multiple may be open.
 * The visible question is the summary's accessible name — no duplicated ARIA roles.
 */
export function FaqDisclosure({
  id,
  question,
  children,
  className,
}: FaqDisclosureProps) {
  const panelId = `${id}-answer`;

  return (
    <details
      id={id}
      className={cn(
        "group border-b border-border-subtle py-4 first:pt-0 last:border-b-0",
        className,
      )}
    >
      <summary
        className={cn(
          "flex cursor-pointer list-none items-start justify-between gap-4",
          "text-left text-base font-semibold text-ink",
          "[&::-webkit-details-marker]:hidden",
        )}
      >
        <span className="min-w-0 flex-1 text-wrap">{question}</span>
        <span
          aria-hidden="true"
          className="mt-0.5 shrink-0 font-normal text-text-muted group-open:hidden"
        >
          +
        </span>
        <span
          aria-hidden="true"
          className="mt-0.5 hidden shrink-0 font-normal text-text-muted group-open:inline"
        >
          −
        </span>
      </summary>
      <div id={panelId} className="max-w-reading pt-3 pb-1 text-text-body">
        {children}
      </div>
    </details>
  );
}
