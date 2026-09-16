import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type ContainerWidth = "default" | "reading";

export type ContainerProps = {
  width?: ContainerWidth;
} & ComponentProps<"div">;

/**
 * Horizontal width and gutters only. Vertical spacing belongs on Section.
 * Place Container inside a full-bleed Section so backgrounds can span the viewport.
 */
export function Container({
  width = "default",
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      {...props}
      className={cn(
        "mx-auto min-w-0 w-full px-gutter",
        width === "reading" ? "max-w-reading" : "max-w-container",
        className,
      )}
    />
  );
}
