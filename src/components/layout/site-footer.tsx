import Link from "next/link";
import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";
import type { PublicContactLink, SiteBrand } from "@/config/brand";
import type { FooterNavigation, NavDestination } from "@/config/navigation";
import {
  getCopyrightYear,
  getPublicFooterContactLinks,
  getPublicFooterNavigation,
  getPublicSiteBrand,
} from "@/server/content";
import { cn } from "@/lib/cn";

function FooterPlannedLabel({ label }: { label: string }) {
  return (
    <span className="inline-flex min-h-11 max-w-full items-center break-words text-base text-text-inverse-muted">
      {label}{" "}
      <span className="font-normal text-text-inverse-muted">(Planned)</span>
    </span>
  );
}

function FooterNavLink({ item }: { item: NavDestination }) {
  if (!item.implemented) {
    return <FooterPlannedLabel label={item.label} />;
  }

  return (
    <TextLink href={item.path} surface="inverse" className="break-words">
      {item.label}
    </TextLink>
  );
}

function FooterNavList({
  headingId,
  heading,
  items,
}: {
  headingId: string;
  heading: string;
  items: NavDestination[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 id={headingId} className="text-base font-semibold text-text-inverse">
        {heading}
      </h3>
      <ul className="mt-3 list-none space-y-1 p-0" aria-labelledby={headingId}>
        {items.map((item) => (
          <li key={item.id} className="min-w-0">
            <FooterNavLink item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterContactList({
  headingId,
  links,
}: {
  headingId: string;
  links: PublicContactLink[];
}) {
  if (links.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 id={headingId} className="text-base font-semibold text-text-inverse">
        Contact
      </h3>
      <ul className="mt-3 list-none space-y-1 p-0" aria-labelledby={headingId}>
        {links.map((link) => (
          <li key={link.id} className="min-w-0">
            <TextLink href={link.href} surface="inverse" className="break-all">
              {link.label}
            </TextLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export type SiteFooterContentProps = {
  brand?: SiteBrand;
  navigation?: FooterNavigation;
  contactLinks?: PublicContactLink[];
  copyrightYear?: number;
  /** Prefix for heading ids when more than one specimen is on a page. */
  idPrefix?: string;
  className?: string;
};

/**
 * Presentational footer body. Does not render a footer landmark so the
 * gallery can reuse it without a second contentinfo landmark.
 */
export function SiteFooterContent({
  brand = getPublicSiteBrand(),
  navigation = getPublicFooterNavigation(),
  contactLinks = getPublicFooterContactLinks(),
  copyrightYear = getCopyrightYear(),
  idPrefix = "site",
  className,
}: SiteFooterContentProps) {
  const showDescription = brand.description.status === "confirmed";
  const exploreId = `${idPrefix}-footer-explore`;
  const servicesId = `${idPrefix}-footer-services`;
  const policiesId = `${idPrefix}-footer-policies`;
  const contactId = `${idPrefix}-footer-contact`;
  const showContactColumn =
    contactLinks.length > 0 || navigation.policies.length > 0;

  return (
    <div className={cn("py-section text-text-inverse-body", className)}>
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="min-w-0 sm:col-span-2 lg:col-span-1">
          <p className="m-0">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center font-semibold text-text-inverse"
              aria-label={`${brand.name} home`}
            >
              {brand.name}
            </Link>
          </p>
          {showDescription ? (
            <p className="mt-3 max-w-reading text-text-inverse-body">
              {brand.description.text}
            </p>
          ) : null}
        </div>

        <FooterNavList
          headingId={exploreId}
          heading="Explore"
          items={navigation.explore}
        />
        <FooterNavList
          headingId={servicesId}
          heading="Services"
          items={navigation.services}
        />
        {showContactColumn ? (
          <div className="flex min-w-0 flex-col gap-10">
            <FooterContactList headingId={contactId} links={contactLinks} />
            <FooterNavList
              headingId={policiesId}
              heading="Policies"
              items={navigation.policies}
            />
          </div>
        ) : null}
      </div>

      <p className="mt-10 border-t border-border-inverse pt-6 text-sm text-text-inverse-muted">
        {`© ${copyrightYear} ${brand.name}`}
      </p>
    </div>
  );
}

/** Live site footer landmark. Server Component. */
export function SiteFooter() {
  return (
    <footer className="bg-ink">
      <Container>
        <SiteFooterContent />
      </Container>
    </footer>
  );
}
