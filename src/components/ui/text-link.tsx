import type { ComponentProps } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

function isInternalHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

export type TextLinkProps = {
  href: string;
  surface?: "light" | "inverse";
  newTab?: boolean;
} & Omit<ComponentProps<"a">, "href">;

export function TextLink({
  href,
  surface = "light",
  newTab = false,
  className,
  children,
  rel,
  target,
  ...props
}: TextLinkProps) {
  const opensInNewTab = newTab || target === "_blank";
  const resolvedTarget = opensInNewTab ? "_blank" : target;
  const resolvedRel = opensInNewTab ? cn("noopener", "noreferrer", rel) : rel;

  const classes = cn(
    "ds-transition font-medium underline decoration-from-font underline-offset-2 hover:underline-offset-4 focus-visible:underline-offset-4",
    surface === "inverse" ? "text-text-inverse" : "text-brand-strong",
    className,
  );

  const content = (
    <>
      {children}
      {opensInNewTab ? (
        <span
          className={cn(
            "font-normal",
            surface === "inverse"
              ? "text-text-inverse-muted"
              : "text-text-muted",
          )}
        >
          {" "}
          (opens in a new tab)
        </span>
      ) : null}
    </>
  );

  if (isInternalHref(href) && !opensInNewTab) {
    return (
      <Link href={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <a
      {...props}
      href={href}
      className={classes}
      target={resolvedTarget}
      rel={resolvedRel}
    >
      {content}
    </a>
  );
}
