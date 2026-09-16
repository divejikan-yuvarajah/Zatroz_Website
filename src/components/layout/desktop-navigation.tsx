"use client";

import { usePathname } from "next/navigation";
import { ButtonLink } from "@/components/ui/button-link";
import type { HeaderNavigation } from "@/config/navigation";
import { ServicesDisclosure } from "@/components/layout/services-disclosure";
import {
  HeaderNavLink,
  PlannedNavLabel,
} from "@/components/layout/header-nav-link";
import { cn } from "@/lib/cn";

export function DesktopNavigation({
  idPrefix,
  items,
  services,
  cta,
  className,
  pathnameOverride,
}: HeaderNavigation & {
  idPrefix: string;
  className?: string;
  pathnameOverride?: string;
}) {
  const livePath = usePathname();
  const pathname = pathnameOverride ?? livePath;
  const hasServices = Boolean(
    services?.overview || (services && services.categories.length > 0),
  );
  const hasItems = items.length > 0 || hasServices || Boolean(cta);

  if (!hasItems) {
    return null;
  }

  return (
    <nav aria-label="Primary" className={className}>
      <ul className="flex list-none flex-wrap items-center gap-1 p-0">
        {hasServices && services ? (
          <li className="min-w-0">
            <ServicesDisclosure
              idPrefix={idPrefix}
              pathname={pathname}
              overview={services.overview}
              categories={services.categories}
            />
          </li>
        ) : null}
        {items.map((item) => (
          <li key={item.id} className="min-w-0">
            <HeaderNavLink item={item} pathname={pathname} />
          </li>
        ))}
        {cta ? (
          <li className={cn("min-w-0", "lg:ml-2")}>
            {cta.implemented ? (
              <ButtonLink href={cta.path} size="compact">
                {cta.label}
              </ButtonLink>
            ) : (
              <PlannedNavLabel label={cta.label} />
            )}
          </li>
        ) : null}
      </ul>
    </nav>
  );
}
