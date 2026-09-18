import { AutomationWorkflowPanel } from "@/components/sections/automation-workflow-panel";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { PublicAutomationExample } from "@/content/automation-example";
import { cn } from "@/lib/cn";

export type HomeAutomationExampleProps = {
  example: PublicAutomationExample;
  headingLevel?: 1 | 2;
  idPrefix?: string;
  className?: string;
};

/**
 * Charcoal homepage automation explanation.
 * Full workflow is always visible; walkthrough is progressive enhancement.
 */
export function HomeAutomationExample({
  example,
  headingLevel = 2,
  idPrefix = "",
  className,
}: HomeAutomationExampleProps) {
  const headingId = `${idPrefix}${example.id}-heading`;
  const sectionId = `${idPrefix}${example.id}`;

  return (
    <Section
      as="section"
      surface="dark"
      id={sectionId}
      aria-labelledby={headingId}
      className={cn(className)}
    >
      <Container>
        <SectionHeading
          level={headingLevel}
          visualLevel={2}
          id={headingId}
          eyebrow={example.workflowLabel}
          description={example.supporting}
          tone="inverse"
        >
          {example.heading}
        </SectionHeading>

        <div className="mt-10">
          <AutomationWorkflowPanel
            stages={example.stages}
            sampleInvoice={example.sampleInvoice}
            completionMessage={example.completionMessage}
            idPrefix={idPrefix}
          />
        </div>

        {example.action ? (
          <p className="mt-10 m-0">
            <ButtonLink
              href={example.action.href}
              variant="secondary"
              className="border-border-inverse bg-transparent text-text-inverse hover:bg-surface-inverse/50"
            >
              {example.action.label}
            </ButtonLink>
          </p>
        ) : null}

        <noscript>
          <div className="mt-10 max-w-reading border-t border-border-inverse pt-8">
            <p className="m-0 text-sm font-semibold text-text-inverse">
              Full illustrative sequence (no JavaScript)
            </p>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-text-inverse-body">
              {example.stages.map((stage) => (
                <li key={stage.id}>
                  <span className="font-medium text-text-inverse">
                    {stage.label}.{" "}
                  </span>
                  {stage.detail}
                </li>
              ))}
            </ol>
            <p className="mt-4 m-0 text-sm text-text-inverse-muted">
              {example.sampleInvoice.caption} Uncertain fields are marked Needs
              review. Approval is always a person — nothing is uploaded or
              processed on this page.
            </p>
          </div>
        </noscript>
      </Container>
    </Section>
  );
}
