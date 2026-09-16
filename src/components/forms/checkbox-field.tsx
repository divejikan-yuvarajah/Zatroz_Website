import type { ComponentProps } from "react";
import { mergeDescribedBy } from "@/lib/described-by";
import { cn } from "@/lib/cn";

export type CheckboxFieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  describedBy?: string;
} & Omit<ComponentProps<"input">, "id" | "type" | "readOnly">;

export function CheckboxField({
  id,
  label,
  hint,
  error,
  describedBy,
  className,
  ...props
}: CheckboxFieldProps) {
  const trimmedHint = hint?.trim();
  const trimmedError = error?.trim();
  const hintId = trimmedHint ? `${id}-hint` : undefined;
  const errorId = trimmedError ? `${id}-error` : undefined;
  const described = mergeDescribedBy(describedBy, hintId, errorId);
  const invalid = Boolean(trimmedError);

  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="flex min-h-11 cursor-pointer items-center gap-3 text-ink"
      >
        <input
          {...props}
          id={id}
          type="checkbox"
          aria-describedby={described}
          aria-invalid={invalid || undefined}
          className={cn(
            "size-4 shrink-0 rounded-sm border-border-control",
            className,
          )}
        />
        <span className="max-w-full break-words">{label}</span>
      </label>
      {trimmedHint ? (
        <p id={hintId} className="ds-support mt-2">
          {trimmedHint}
        </p>
      ) : null}
      {trimmedError ? (
        <p id={errorId} className="mt-2 break-words text-sm text-error">
          {trimmedError}
        </p>
      ) : null}
    </div>
  );
}
