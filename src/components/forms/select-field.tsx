import type { ComponentProps } from "react";
import { selectControlClassName } from "@/components/forms/form-control-styles";

export type SelectFieldProps = Omit<ComponentProps<"select">, "readOnly">;

function isInvalid(value: ComponentProps<"select">["aria-invalid"]): boolean {
  return value === true || value === "true";
}

export function SelectField({
  className,
  "aria-invalid": ariaInvalid,
  children,
  ...props
}: SelectFieldProps) {
  return (
    <select
      {...props}
      aria-invalid={ariaInvalid}
      className={selectControlClassName({
        invalid: isInvalid(ariaInvalid),
        className,
      })}
    >
      {children}
    </select>
  );
}
