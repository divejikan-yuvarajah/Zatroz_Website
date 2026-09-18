import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { FaqDisclosure } from "@/components/ui/faq-disclosure";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { PublicProcessPage } from "@/server/process";
import { cn } from "@/lib/cn";

export type ProcessPageProps = {
  process: PublicProcessPage;
  headingLevel?: 1 | 2;
  idPrefix?: string;
  className?: string;
  showBreadcrumb?: boolean;
};

/**
 * How We Work page. Server Component.
 * Stages stay visible in a semantic ordered list — no accordion gate.
 */
export function ProcessPage({
  process,
  headingLevel = 1,
  idPrefix = "",
  className,
  showBreadcrumb = true,
}: ProcessPageProps) {
  const heroId = `${idPrefix}process-hero`;
  const headingId = `${idPrefix}process-heading`;

  return (
    <div className={cn(className)}>
      <Section
        as="section"
        surface="light"
        id={heroId}
        aria-labelledby={headingId}
      >
        <Container>
          {showBreadcrumb ? (
            <PageBreadcrumb
              className="mb-8"
              items={[{ label: "Home", href: "/" }, { label: "Process" }]}
            />
          ) : null}

          <div className="max-w-reading">
            <SectionHeading
              level={headingLevel}
              visualLevel={1}
              id={headingId}
              description={process.introduction}
            >
              {process.heroTitle}
            </SectionHeading>

            <div className="mt-8 flex flex-wrap gap-3">
              {process.enquiryAction ? (
                <ButtonLink
                  href={process.enquiryAction.href}
                  variant="primary"
                  newTab={process.enquiryAction.href.startsWith("https://")}
                >
                  {process.enquiryAction.label}
                </ButtonLink>
              ) : null}
              {process.workAction ? (
                <ButtonLink href={process.workAction.href} variant="secondary">
                  {process.workAction.label}
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </Container>
      </Section>

      <Section
        as="section"
        surface="muted"
        id={`${idPrefix}stages`}
        aria-labelledby={`${idPrefix}stages-heading`}
      >
        <Container>
          <div className="max-w-reading">
            <h2 id={`${idPrefix}stages-heading`} className="ds-h2 m-0">
              {process.stagesHeading}
            </h2>
            <p className="mt-4 m-0 text-text-body">
              {process.stagesSupporting}
            </p>
          </div>

          <ol className="mt-10 list-none space-y-0 p-0">
            {process.stages.map((stage) => {
              const stageHeadingId = `${idPrefix}${stage.id}-heading`;

              return (
                <li
                  key={stage.id}
                  id={`${idPrefix}${stage.id}`}
                  className="scroll-mt-24 border-t border-border-subtle py-10 first:border-t-0 first:pt-0"
                >
                  <article aria-labelledby={stageHeadingId}>
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <span
                        className="font-mono text-sm font-medium text-text-muted"
                        aria-hidden="true"
                      >
                        {String(stage.number).padStart(2, "0")}
                      </span>
                      <h3 id={stageHeadingId} className="ds-h3 m-0">
                        {stage.title}
                      </h3>
                    </div>

                    <dl className="mt-6 grid max-w-reading gap-6">
                      <div>
                        <dt className="m-0 text-sm font-semibold text-ink">
                          What we do
                        </dt>
                        <dd className="mt-2 m-0 text-text-body">
                          {stage.whatWeDo}
                        </dd>
                      </div>
                      <div>
                        <dt className="m-0 text-sm font-semibold text-ink">
                          What we need from you
                        </dt>
                        <dd className="mt-2 m-0 text-text-body">
                          {stage.whatWeNeed}
                        </dd>
                      </div>
                      <div>
                        <dt className="m-0 text-sm font-semibold text-ink">
                          What you receive
                        </dt>
                        <dd className="mt-2 m-0 text-text-body">
                          {stage.whatYouReceive}
                        </dd>
                      </div>
                    </dl>
                  </article>
                </li>
              );
            })}
          </ol>
        </Container>
      </Section>

      <Section
        as="section"
        surface="light"
        id={`${idPrefix}collaboration`}
        aria-labelledby={`${idPrefix}collaboration-heading`}
      >
        <Container width="reading">
          <h2 id={`${idPrefix}collaboration-heading`} className="ds-h2 m-0">
            {process.collaborationHeading}
          </h2>
          <div className="mt-6 space-y-4">
            {process.collaborationBody.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="m-0 text-text-body">
                {paragraph}
              </p>
            ))}
          </div>

          <h3
            id={`${idPrefix}dependencies-heading`}
            className="ds-h3 mt-10 m-0"
          >
            {process.dependenciesHeading}
          </h3>
          <p className="mt-4 m-0 text-text-body">{process.dependenciesBody}</p>

          <h3 id={`${idPrefix}acceptance-heading`} className="ds-h3 mt-10 m-0">
            {process.acceptanceHeading}
          </h3>
          <p className="mt-4 m-0 text-text-body">{process.acceptanceBody}</p>
        </Container>
      </Section>

      <Section
        as="section"
        surface="muted"
        id={`${idPrefix}prepare`}
        aria-labelledby={`${idPrefix}prepare-heading`}
      >
        <Container width="reading">
          <h2 id={`${idPrefix}prepare-heading`} className="ds-h2 m-0">
            {process.prepareHeading}
          </h2>
          <p className="mt-4 m-0 text-text-body">{process.prepareSupporting}</p>
          <ul className="mt-6 list-disc space-y-2 pl-5 text-text-body">
            {process.prepareItems.map((item) => (
              <li key={item.id}>{item.text}</li>
            ))}
          </ul>
          <p className="mt-6 m-0 text-sm text-text-muted">
            {process.prepareSensitiveNote}
          </p>
        </Container>
      </Section>

      <Section
        as="section"
        surface="light"
        id={`${idPrefix}faqs`}
        aria-labelledby={`${idPrefix}faqs-heading`}
      >
        <Container width="reading">
          <h2 id={`${idPrefix}faqs-heading`} className="ds-h2 m-0">
            {process.faqHeading}
          </h2>
          <div className="mt-8">
            {process.faqs.map((faq) => (
              <FaqDisclosure
                key={faq.id}
                id={`${idPrefix}${faq.id}`}
                question={faq.question}
              >
                <p className="m-0">{faq.answer}</p>
              </FaqDisclosure>
            ))}
          </div>
        </Container>
      </Section>

      {process.enquiryAction ? (
        <Section
          as="section"
          surface="muted"
          id={`${idPrefix}enquire`}
          aria-labelledby={`${idPrefix}enquire-heading`}
        >
          <Container width="reading">
            <h2 id={`${idPrefix}enquire-heading`} className="ds-h2 m-0">
              Ready to talk through a project?
            </h2>
            <p className="mt-4 m-0 text-text-body">
              An early idea is enough to start. We reply with a clear next step
              — not a packaged price list on this page.
            </p>
            <p className="mt-8 m-0">
              <ButtonLink
                href={process.enquiryAction.href}
                variant="primary"
                newTab={process.enquiryAction.href.startsWith("https://")}
              >
                {process.enquiryAction.label}
              </ButtonLink>
            </p>
          </Container>
        </Section>
      ) : null}
    </div>
  );
}
