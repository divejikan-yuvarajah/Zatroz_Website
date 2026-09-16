import type { ComponentProps } from "react";
import { textControlClassName } from "@/components/forms/form-control-styles";

export type TextInputProps = ComponentProps<"input">;

function isInvalid(value: ComponentProps<"input">["aria-invalid"]): boolean {
  return value === true || value === "true";
}

export function TextInput({
  className,
  type = "text",
  readOnly,
  "aria-invalid": ariaInvalid,
  ...props
}: TextInputProps) {
  return (
    <input
      {...props}
      type={type}
      readOnly={readOnly}
      aria-invalid={ariaInvalid}
      className={textControlClassName({
        invalid: isInvalid(ariaInvalid),
        readOnly: Boolean(readOnly),
        className,
      })}
    />
  );
}
