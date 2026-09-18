import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { PublicHomeProcess } from "@/content/process";
import { cn } from "@/lib/cn";

export type HomeProcessProps = {
  process: PublicHomeProcess;
  headingLevel?: 1 | 2;
  idPrefix?: string;
  className?: string;
};

/**
 * Calm homepage delivery process. All steps visible — no interaction required.
 */
export function HomeProcess({
  process,
  headingLevel = 2,
  idPrefix = "",
  className,
}: HomeProcessProps) {
  const headingId = `${idPrefix}${process.id}-heading`;
  const sectionId = `${idPrefix}${process.id}`;

  return (
    <Section
      as="section"
      surface="light"
      id={sectionId}
      aria-labelledby={headingId}
      className={cn(className)}
    >
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0 max-w-reading">
            <SectionHeading
              level={headingLevel}
              visualLevel={2}
              id={headingId}
              description={process.supporting}
            >
              {process.heading}
            </SectionHeading>
            {process.action ? (
              <p className="mt-8 m-0">
                <ButtonLink href={process.action.href} variant="secondary">
                  {process.action.label}
                </ButtonLink>
              </p>
            ) : null}
          </div>

          <ol className="m-0 list-none space-y-0 p-0">
            {process.steps.map((step, index) => {
              const stepHeadingId = `${idPrefix}${step.id}-title`;
              const isLast = index === process.steps.length - 1;

              return (
                <li key={step.id} className="min-w-0">
                  <article aria-labelledby={stepHeadingId} className="min-w-0">
                    <p className="m-0 text-sm font-medium text-text-muted">
                      Step {step.number}
                    </p>
                    <h3 id={stepHeadingId} className="ds-h3 mt-1 m-0">
                      {step.title}
                    </h3>
                    <p className="mt-3 m-0 text-text-body">
                      {step.description}
                    </p>
                    <p className="mt-3 m-0 text-sm text-text-body">
                      <span className="font-semibold text-ink">
                        You leave with.{" "}
                      </span>
                      {step.customerOutput}
                    </p>
                  </article>

                  {!isLast ? (
                    <div
                      className="my-6 h-px w-full bg-border-subtle"
                      aria-hidden="true"
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
