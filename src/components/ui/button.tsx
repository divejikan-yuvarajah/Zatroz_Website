import type { ComponentProps } from "react";
import {
  buttonClassName,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button-styles";
import { cn } from "@/lib/cn";

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingLabel?: string;
} & ComponentProps<"button">;

function Spinner() {
  return (
    <span
      className="inline-block size-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none"
      aria-hidden="true"
    />
  );
}

export function Button({
  variant = "primary",
  size = "normal",
  loading = false,
  loadingLabel = "Loading",
  className,
  disabled,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  const isInactive = Boolean(disabled || loading);

  return (
    <button
      {...props}
      type={type}
      className={buttonClassName({ variant, size, className })}
      disabled={isInactive}
      aria-busy={loading || undefined}
    >
      <span className="relative inline-grid max-w-full justify-items-center">
        <span
          className={cn("max-w-full break-words", loading && "invisible")}
          aria-hidden={loading || undefined}
        >
          {children}
        </span>
        {loading ? (
          <span className="absolute inset-0 flex items-center justify-center gap-2">
            <Spinner />
            <span>{loadingLabel}</span>
          </span>
        ) : null}
      </span>
    </button>
  );
}
