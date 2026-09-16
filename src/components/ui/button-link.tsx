import type { ComponentProps } from "react";
import Link from "next/link";
import {
  buttonClassName,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button-styles";
import { cn } from "@/lib/cn";

function isInternalHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

export type ButtonLinkProps = {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  newTab?: boolean;
} & Omit<ComponentProps<"a">, "href">;

export function ButtonLink({
  href,
  variant = "primary",
  size = "normal",
  newTab = false,
  className,
  children,
  rel,
  target,
  ...props
}: ButtonLinkProps) {
  const classes = buttonClassName({ variant, size, className });
  const opensInNewTab = newTab || target === "_blank";
  const resolvedTarget = opensInNewTab ? "_blank" : target;
  const resolvedRel = opensInNewTab ? cn("noopener", "noreferrer", rel) : rel;

  const content = (
    <>
      <span className="max-w-full break-words">{children}</span>
      {opensInNewTab ? (
        <span className="text-sm font-normal text-inherit">
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
