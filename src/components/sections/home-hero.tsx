import { BusinessWorkflowVisual } from "@/components/sections/business-workflow-visual";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { PublicHomeHero } from "@/server/home";
import { cn } from "@/lib/cn";

export type HomeHeroProps = {
  hero: PublicHomeHero;
  /** Use 2 in the gallery so the page keeps a single H1. */
  headingLevel?: 1 | 2;
  idPrefix?: string;
  className?: string;
};

export function HomeHero({
  hero,
  headingLevel = 1,
  idPrefix = "",
  className,
}: HomeHeroProps) {
  const headingId = `${idPrefix}${hero.id}-heading`;
  const sectionId = `${idPrefix}${hero.id}`;
  const hasActions = Boolean(hero.primaryCta || hero.secondaryCta);

  return (
    <Section
      as="section"
      surface="light"
      id={sectionId}
      aria-labelledby={headingId}
      className={cn(className)}
    >
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="min-w-0 max-w-reading">
            <SectionHeading
              level={headingLevel}
              visualLevel={1}
              id={headingId}
              eyebrow={hero.eyebrow}
            >
              {hero.headline}
            </SectionHeading>
            <p className="mt-4 text-text-body">{hero.supporting}</p>
            {hasActions ? (
              <div className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row sm:flex-wrap">
                {hero.primaryCta ? (
                  <ButtonLink
                    href={hero.primaryCta.href}
                    className="w-full sm:w-auto"
                  >
                    {hero.primaryCta.label}
                  </ButtonLink>
                ) : null}
                {hero.secondaryCta ? (
                  <ButtonLink
                    href={hero.secondaryCta.href}
                    variant="secondary"
                    className="w-full sm:w-auto"
                  >
                    {hero.secondaryCta.label}
                  </ButtonLink>
                ) : null}
              </div>
            ) : null}
          </div>

          <BusinessWorkflowVisual
            scenario={hero.scenario}
            caption={hero.workflowCaption}
            className="min-w-0"
          />
        </div>
      </Container>
    </Section>
  );
}
