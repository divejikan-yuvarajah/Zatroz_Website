"use client";

import type { MouseEvent, Ref } from "react";
import { TextLink } from "@/components/ui/text-link";

export type ErrorSummaryItem = {
  id: string;
  message: string;
};

export type ErrorSummaryProps = {
  id?: string;
  heading?: string;
  errors: ErrorSummaryItem[];
  ref?: Ref<HTMLDivElement>;
};

function focusControl(controlId: string, event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  const control = document.getElementById(controlId);
  if (control instanceof HTMLElement) {
    control.focus();
  }
}

/**
 * Renders only when there are errors. Focus this container after submit;
 * do not also announce the same errors in a live region.
 */
export function ErrorSummary({
  id = "error-summary",
  heading = "There is a problem",
  errors,
  ref,
}: ErrorSummaryProps) {
  if (errors.length === 0) {
    return null;
  }

  const headingId = `${id}-heading`;

  return (
    <div
      ref={ref}
      id={id}
      tabIndex={-1}
      aria-labelledby={headingId}
      className="rounded-md border border-error bg-error-soft p-4 text-error focus:outline focus:outline-[3px] focus:outline-offset-[3px] focus:[outline-color:var(--ink)]"
    >
      <h3 id={headingId} className="m-0 text-ink">
        {heading}
      </h3>
      <ul className="mt-3 list-disc space-y-2 pl-5">
        {errors.map((item) => (
          <li key={item.id}>
            <TextLink
              href={`#${item.id}`}
              onClick={(event) => focusControl(item.id, event)}
            >
              {item.message}
            </TextLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
