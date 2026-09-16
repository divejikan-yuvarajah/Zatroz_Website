import type { ComponentProps } from "react";
import { textControlClassName } from "@/components/forms/form-control-styles";
import { cn } from "@/lib/cn";

export type TextAreaProps = ComponentProps<"textarea">;

function isInvalid(value: ComponentProps<"textarea">["aria-invalid"]): boolean {
  return value === true || value === "true";
}

export function TextArea({
  className,
  readOnly,
  "aria-invalid": ariaInvalid,
  rows = 5,
  ...props
}: TextAreaProps) {
  return (
    <textarea
      {...props}
      rows={rows}
      readOnly={readOnly}
      aria-invalid={ariaInvalid}
      className={textControlClassName({
        invalid: isInvalid(ariaInvalid),
        readOnly: Boolean(readOnly),
        className: cn("min-h-32 resize-y break-words", className),
      })}
    />
  );
}
