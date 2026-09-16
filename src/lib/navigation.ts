/**
 * Pure path helpers for navigation active states.
 * Hash and query strings are not part of page identity.
 */

export type NavLinkState = {
  isCurrent: boolean;
  isSection: boolean;
};

export function normalizePathname(pathname: string): string {
  const withoutHash = pathname.split("#")[0] ?? "";
  const withoutQuery = withoutHash.split("?")[0] ?? "";
  if (!withoutQuery || withoutQuery === "") {
    return "/";
  }
  if (withoutQuery.length > 1 && withoutQuery.endsWith("/")) {
    return withoutQuery.slice(0, -1);
  }
  return withoutQuery;
}

export function getNavLinkState(
  currentPath: string,
  href: string,
): NavLinkState {
  if (!href || href.startsWith("#") || href.startsWith("//")) {
    return { isCurrent: false, isSection: false };
  }

  const current = normalizePathname(currentPath);
  const target = normalizePathname(href);

  if (target === "/") {
    const isCurrent = current === "/";
    return { isCurrent, isSection: isCurrent };
  }

  const isCurrent = current === target;
  const isSection = isCurrent || current.startsWith(`${target}/`);
  return { isCurrent, isSection };
}
