import type { MouseEvent } from "react";
import Link from "next/link";
import type { NavDestination } from "@/config/navigation";
import { getNavLinkState } from "@/lib/navigation";
import {
  navLinkClassName,
  plannedNavClassName,
  type NavVisualState,
} from "@/components/layout/nav-link-styles";

function isHashHref(href: string): boolean {
  return href.startsWith("#");
}

export function PlannedNavLabel({ label }: { label: string }) {
  return (
    <span className={plannedNavClassName()}>
      {label} <span className="ds-support font-normal">(Planned)</span>
    </span>
  );
}

export function HeaderNavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: NavDestination;
  pathname: string;
  onNavigate?: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  if (!item.implemented) {
    return <PlannedNavLabel label={item.label} />;
  }

  const { isCurrent, isSection } = getNavLinkState(pathname, item.path);
  const state: NavVisualState = isCurrent
    ? "current"
    : isSection
      ? "section"
      : "idle";
  const className = navLinkClassName(state);
  const current = isCurrent ? ("page" as const) : undefined;

  if (isHashHref(item.path)) {
    return (
      <a href={item.path} className={className} onClick={onNavigate}>
        {item.label}
      </a>
    );
  }

  return (
    <Link
      href={item.path}
      className={className}
      aria-current={current}
      onClick={onNavigate}
    >
      {item.label}
    </Link>
  );
}
