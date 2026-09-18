import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { TextLink } from "@/components/ui/text-link";
import type { PublicHomeEvidence } from "@/server/home";
import { cn } from "@/lib/cn";

export type HomeEvidenceProps = {
  evidence: PublicHomeEvidence;
  /** Use 2 in the gallery so the page keeps a single H1. */
  headingLevel?: 1 | 2;
  idPrefix?: string;
  className?: string;
};

/**
 * Compact credibility strip. Server-rendered; no counters or logo walls.
 */
export function HomeEvidence({
  evidence,
  headingLevel = 2,
  idPrefix = "",
  className,
}: HomeEvidenceProps) {
  const headingId = `${idPrefix}${evidence.id}-heading`;
  const sectionId = `${idPrefix}${evidence.id}`;
  const itemCount = evidence.items.length;
  const listClass =
    itemCount >= 3
      ? "mt-8 grid list-none gap-8 p-0 sm:grid-cols-2 lg:grid-cols-3"
      : itemCount === 2
        ? "mt-8 grid list-none gap-8 p-0 sm:grid-cols-2"
        : "mt-8 grid list-none gap-8 p-0";

  return (
    <Section
      as="section"
      surface="muted"
      id={sectionId}
      aria-labelledby={headingId}
      className={cn(className)}
    >
      <Container>
        <SectionHeading
          level={headingLevel}
          visualLevel={3}
          id={headingId}
          description={evidence.intro ?? undefined}
        >
          {evidence.heading}
        </SectionHeading>

        {itemCount > 0 ? (
          <ul className={listClass}>
            {evidence.items.map((item) => (
              <li key={item.id} className="min-w-0 max-w-reading">
                <p className="m-0 text-sm font-medium text-text-muted">
                  {item.supportingLabel}
                </p>
                <p className="mt-2 m-0 text-base font-semibold text-ink">
                  {item.claim}
                </p>
                <p className="mt-1 m-0 text-sm text-text-body">
                  {item.subjectLabel}
                </p>
                {item.link ? (
                  <p className="mt-3 m-0">
                    <TextLink href={item.link.href}>{item.link.label}</TextLink>
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </Section>
  );
}
