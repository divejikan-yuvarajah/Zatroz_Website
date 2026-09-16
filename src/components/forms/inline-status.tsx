import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type InlineStatusTone = "idle" | "pending" | "success" | "error";

export type InlineStatusProps = {
  id?: string;
  tone?: InlineStatusTone;
  children?: ReactNode;
};

const toneClass: Record<Exclude<InlineStatusTone, "idle">, string> = {
  pending: "bg-surface-muted text-text-body",
  success: "bg-success-soft text-success",
  error: "bg-error-soft text-error",
};

/**
 * Keep this mounted so the live region stays stable.
 * Use pending/success as polite status. Use error as an alert only when
 * ErrorSummary is not also being focused for the same moment.
 */
export function InlineStatus({
  id,
  tone = "idle",
  children,
}: InlineStatusProps) {
  const isError = tone === "error";

  return (
    <div
      id={id}
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      aria-atomic="true"
    >
      {tone === "idle" ? null : (
        <p className={cn("rounded-md p-4 break-words", toneClass[tone])}>
          {children}
        </p>
      )}
    </div>
  );
}
