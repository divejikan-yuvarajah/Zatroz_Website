import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { TextLink } from "@/components/ui/text-link";
import type { PublicHomeFinalCta } from "@/content/home-final-cta";
import { cn } from "@/lib/cn";

export type HomeFinalCtaProps = {
  invitation: PublicHomeFinalCta;
  headingLevel?: 1 | 2;
  idPrefix?: string;
  className?: string;
};

/**
 * Final homepage enquiry invitation. Warm-white editorial close before the footer.
 * Renders only when a real primary action exists — no dead buttons.
 */
export function HomeFinalCta({
  invitation,
  headingLevel = 2,
  idPrefix = "",
  className,
}: HomeFinalCtaProps) {
  const headingId = `${idPrefix}${invitation.id}-heading`;
  const sectionId = `${idPrefix}${invitation.id}`;

  return (
    <Section
      as="section"
      surface="light"
      id={sectionId}
      aria-labelledby={headingId}
      className={cn(className)}
    >
      <Container width="reading">
        <div className="border-l-2 border-brand pl-6 sm:pl-8">
          <SectionHeading
            level={headingLevel}
            visualLevel={2}
            id={headingId}
            description={invitation.supporting}
          >
            {invitation.heading}
          </SectionHeading>

          <p className="mt-8 m-0">
            <ButtonLink
              href={invitation.primary.href}
              variant="primary"
              newTab={invitation.primary.href.startsWith("https://")}
            >
              {invitation.primary.label}
            </ButtonLink>
          </p>

          {invitation.alternatives.length > 0 ? (
            <ul className="mt-6 list-none space-y-2 p-0">
              {invitation.alternatives.map((alt) => (
                <li key={`${alt.label}-${alt.href}`} className="min-w-0">
                  <TextLink
                    href={alt.href}
                    newTab={alt.href.startsWith("https://")}
                  >
                    {alt.label}
                  </TextLink>
                </li>
              ))}
            </ul>
          ) : null}

          {invitation.primary.href.startsWith("mailto:") ||
          invitation.primary.href.startsWith("https://wa.me/") ? (
            <p className="mt-6 m-0 text-sm text-text-muted">
              Opening email or WhatsApp starts a conversation. It does not
              submit an enquiry form or book a meeting.
            </p>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
