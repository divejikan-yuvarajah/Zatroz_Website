import type { ReactNode } from "react";
import { mergeDescribedBy } from "@/lib/described-by";

export type FormFieldControlProps = {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  "aria-required"?: boolean;
};

export type FormFieldProps = {
  /** Stable control id. Pass the same value into examples; do not generate random ids. */
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  /** Extra described-by ids (for example a group hint). Merged with hint/error ids. */
  describedBy?: string;
  children: (control: FormFieldControlProps) => ReactNode;
};

export function FormField({
  id,
  label,
  hint,
  error,
  required = false,
  optional = false,
  describedBy,
  children,
}: FormFieldProps) {
  const trimmedHint = hint?.trim();
  const trimmedError = error?.trim();
  const hintId = trimmedHint ? `${id}-hint` : undefined;
  const errorId = trimmedError ? `${id}-error` : undefined;
  const described = mergeDescribedBy(describedBy, hintId, errorId);
  const invalid = Boolean(trimmedError);
  const showOptional = optional && !required;

  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block font-medium text-ink">
        {label}
        {required ? (
          <span className="font-normal text-text-muted"> (required)</span>
        ) : null}
        {showOptional ? (
          <span className="font-normal text-text-muted"> (optional)</span>
        ) : null}
      </label>
      <div className="mt-2">
        {children({
          id,
          "aria-describedby": described,
          "aria-invalid": invalid || undefined,
          "aria-required": required || undefined,
        })}
      </div>
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
