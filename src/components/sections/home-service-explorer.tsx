import type { PublicServiceExplorer } from "@/content/business-needs";
import { ServiceExplorerPanel } from "@/components/sections/service-explorer-panel";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";

export type HomeServiceExplorerProps = {
  explorer: PublicServiceExplorer;
  headingLevel?: 1 | 2;
  idPrefix?: string;
  className?: string;
};

/**
 * Homepage business-needs service explorer.
 * Interactive disclosure is isolated in ServiceExplorerPanel.
 */
export function HomeServiceExplorer({
  explorer,
  headingLevel = 2,
  idPrefix = "",
  className,
}: HomeServiceExplorerProps) {
  const headingId = `${idPrefix}${explorer.id}-heading`;
  const sectionId = `${idPrefix}${explorer.id}`;

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
          visualLevel={2}
          id={headingId}
          description={explorer.supporting}
        >
          {explorer.heading}
        </SectionHeading>

        <div className="mt-10">
          <ServiceExplorerPanel
            needs={explorer.needs}
            defaultNeedId={explorer.defaultNeedId}
            idPrefix={idPrefix}
          />
        </div>

        <noscript>
          <div className="mt-10 space-y-10 border-t border-border-subtle pt-10">
            <p className="m-0 text-sm font-semibold text-ink">
              All business needs (no JavaScript)
            </p>
            {explorer.needs.map((need) => (
              <article key={need.id} className="max-w-reading">
                <h3 className="ds-h3 m-0">
                  {need.number}. {need.title}
                </h3>
                <p className="mt-3 m-0 text-text-body">{need.explanation}</p>
                <p className="mt-3 m-0 text-text-body">
                  <span className="font-medium text-ink">
                    Typical deliverable.{" "}
                  </span>
                  {need.deliverable}
                </p>
                {need.services.length > 0 ? (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-text-body">
                    {need.services.map((service) => (
                      <li key={service.id}>
                        <span className="font-medium text-ink">
                          {service.title}.{" "}
                        </span>
                        {service.summary}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </noscript>
      </Container>
    </Section>
  );
}
