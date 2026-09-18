"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNavLinkState } from "@/lib/navigation";
import { cn } from "@/lib/cn";

export function HomeLink({
  className,
  pathnameOverride,
  id,
}: {
  className?: string;
  pathnameOverride?: string;
  id?: string;
}) {
  const livePath = usePathname();
  const { isCurrent } = getNavLinkState(pathnameOverride ?? livePath, "/");

  return (
    <Link
      id={id}
      href="/"
      className={cn(
        "inline-flex min-h-11 items-center font-semibold text-ink",
        className,
      )}
      aria-label="Zatroz home"
      aria-current={isCurrent ? "page" : undefined}
    >
      <span aria-hidden="true">Zatroz</span>
    </Link>
  );
}
