import { Container } from "@/components/ui/container";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { TextLink } from "@/components/ui/text-link";
import type { PublicPolicyPage } from "@/server/legal-policies";
import { cn } from "@/lib/cn";

export type PolicyPageProps = {
  policy: PublicPolicyPage;
  headingLevel?: 1 | 2;
  idPrefix?: string;
  className?: string;
  showBreadcrumb?: boolean;
  /** Show draft/version chrome — gallery only. */
  showDraftChrome?: boolean;
};

/**
 * Shared Privacy / Terms document layout.
 * Server Component. Reading measure, stable anchors, optional TOC.
 */
export function PolicyPage({
  policy,
  headingLevel = 1,
  idPrefix = "",
  className,
  showBreadcrumb = true,
  showDraftChrome = false,
}: PolicyPageProps) {
  const headingId = `${idPrefix}${policy.kind}-heading`;
  const breadcrumbLabel = policy.kind === "privacy" ? "Privacy" : "Terms";
  const showToc = policy.sections.length >= 4;

  return (
    <div className={cn("policy-document", className)}>
      <Section as="section" surface="light" aria-labelledby={headingId}>
        <Container width="reading">
          {showBreadcrumb ? (
            <PageBreadcrumb
              className="mb-8"
              items={[{ label: "Home", href: "/" }, { label: breadcrumbLabel }]}
            />
          ) : null}

          <SectionHeading
            level={headingLevel}
            visualLevel={1}
            id={headingId}
            description={policy.introduction}
          >
            {policy.heroTitle}
          </SectionHeading>

          {showDraftChrome ? (
            <p className="mt-4 m-0 text-sm text-text-muted">
              Draft for review — version {policy.version}
              {policy.lastReviewedOn
                ? ` · last reviewed ${policy.lastReviewedOn}`
                : ""}
              . Not a public effective date.
            </p>
          ) : null}

          {policy.effectiveOn ? (
            <p className="mt-4 m-0 text-sm text-text-muted">
              Effective {policy.effectiveOn}
            </p>
          ) : null}

          {policy.contactEmailHref ? (
            <p className="mt-6 m-0">
              <TextLink href={policy.contactEmailHref}>Contact Zatroz</TextLink>
            </p>
          ) : null}
        </Container>
      </Section>

      <Section as="section" surface="muted" aria-label="Policy body">
        <Container>
          <div
            className={cn(
              "gap-10",
              showToc
                ? "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(12rem,16rem)] lg:items-start"
                : "max-w-reading",
            )}
          >
            <div className="min-w-0 max-w-reading space-y-12">
              {policy.sections.map((section) => {
                const sectionId = `${idPrefix}${section.id}`;
                const sectionHeadingId = `${sectionId}-heading`;
                return (
                  <section
                    key={section.id}
                    id={sectionId}
                    aria-labelledby={sectionHeadingId}
                    className="scroll-mt-28"
                  >
                    <h2 id={sectionHeadingId} className="ds-h2 m-0">
                      {section.title}
                    </h2>
                    {section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 48)}
                        className="mt-4 m-0 text-text-body"
                      >
                        {paragraph}
                      </p>
                    ))}
                    {section.bullets.length > 0 ? (
                      <ul className="mt-4 list-disc space-y-2 pl-5 text-text-body">
                        {section.bullets.map((bullet) => (
                          <li key={bullet.slice(0, 48)}>{bullet}</li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                );
              })}
            </div>

            {showToc ? (
              <nav
                aria-label="On this page"
                className="min-w-0 text-sm text-text-muted print:hidden lg:sticky lg:top-28"
              >
                <p className="m-0 font-semibold text-ink">On this page</p>
                <ol className="mt-3 list-none space-y-2 p-0">
                  {policy.sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${idPrefix}${section.id}`}
                        className="font-medium text-brand-strong underline decoration-from-font underline-offset-2"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            ) : null}
          </div>
        </Container>
      </Section>
    </div>
  );
}
