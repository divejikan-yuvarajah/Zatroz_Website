import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { ProjectFeature } from "@/components/sections/project-feature";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { PublicSelectedWork } from "@/server/home";
import { cn } from "@/lib/cn";

export type HomeFeaturedWorkProps = {
  selectedWork: PublicSelectedWork;
  headingLevel?: 1 | 2;
  idPrefix?: string;
  className?: string;
};

/**
 * Homepage selected-work section. Renders only when the caller has a
 * non-empty public projection — never an empty grid.
 */
export function HomeFeaturedWork({
  selectedWork,
  headingLevel = 2,
  idPrefix = "",
  className,
}: HomeFeaturedWorkProps) {
  const headingId = `${idPrefix}${selectedWork.id}-heading`;
  const sectionId = `${idPrefix}${selectedWork.id}`;
  const features = selectedWork.features;
  const count = features.length;

  return (
    <Section
      as="section"
      surface="light"
      id={sectionId}
      aria-labelledby={headingId}
      className={cn(className)}
    >
      <Container>
        <SectionHeading
          level={headingLevel}
          visualLevel={2}
          id={headingId}
          description={selectedWork.supporting}
        >
          {selectedWork.heading}
        </SectionHeading>

        {count === 1 ? (
          <RevealOnScroll className="mt-12">
            <ProjectFeature
              feature={features[0]!}
              emphasis="lead"
              headingLevel={3}
              idPrefix={idPrefix}
            />
          </RevealOnScroll>
        ) : null}

        {count === 2 ? (
          <RevealOnScroll className="mt-12 grid gap-14 lg:grid-cols-2 lg:gap-12">
            {features.map((feature) => (
              <ProjectFeature
                key={feature.id}
                feature={feature}
                emphasis="standard"
                headingLevel={3}
                idPrefix={idPrefix}
              />
            ))}
          </RevealOnScroll>
        ) : null}

        {count >= 3 ? (
          <RevealOnScroll className="mt-12 flex flex-col gap-14">
            <ProjectFeature
              feature={features[0]!}
              emphasis="lead"
              headingLevel={3}
              idPrefix={idPrefix}
            />
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-12">
              {features.slice(1, 3).map((feature) => (
                <ProjectFeature
                  key={feature.id}
                  feature={feature}
                  emphasis="secondary"
                  headingLevel={3}
                  idPrefix={idPrefix}
                />
              ))}
            </div>
          </RevealOnScroll>
        ) : null}
      </Container>
    </Section>
  );
}
