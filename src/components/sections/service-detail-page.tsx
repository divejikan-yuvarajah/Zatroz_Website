import { FaqDisclosure } from "@/components/ui/faq-disclosure";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { TextLink } from "@/components/ui/text-link";
import {
  ServiceHeroBrowserVisual,
  ServiceHeroDevicePairVisual,
  ServiceHeroModulesLinkVisual,
  ServiceHeroOpsSummaryVisual,
  ServiceHeroReviewWorkflowVisual,
} from "@/components/sections/service-browser-frame";
import { AiAutomationWorkflow } from "@/components/sections/ai-automation-workflow";
import { BusinessOpsPanel } from "@/components/sections/business-ops-panel";
import { CustomSoftwareGuide } from "@/components/sections/custom-software-guide";
import { WebMobileTaskComparison } from "@/components/sections/web-mobile-task-comparison";
import { WebsitesCatalogueComparison } from "@/components/sections/websites-catalogue-comparison";
import type { PublicServiceDetail } from "@/server/service-detail";
import { cn } from "@/lib/cn";

export type ServiceDetailPageProps = {
  detail: PublicServiceDetail;
  headingLevel?: 1 | 2;
  idPrefix?: string;
  className?: string;
  showBreadcrumb?: boolean;
};

function sid(prefix: string, id: string): string {
  return `${prefix}${id}`;
}

/**
 * Reusable service detail template. Server-rendered; optional sections omit
 * empty headings. Gallery specimens pass idPrefix for unique anchors.
 */
export function ServiceDetailPage({
  detail,
  headingLevel = 1,
  idPrefix = "",
  className,
  showBreadcrumb = true,
}: ServiceDetailPageProps) {
  const heroId = sid(idPrefix, "hero");
  const headingId = sid(idPrefix, "hero-heading");
  const showContents = detail.sectionIds.length > 4;

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
              items={[
                { label: "Home", href: "/" },
                { label: "Services", href: "/services" },
                { label: detail.serviceTitle },
              ]}
            />
          ) : null}

          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(12rem,18rem)] lg:gap-16">
            <div className="min-w-0 max-w-reading">
              <SectionHeading
                level={headingLevel}
                visualLevel={1}
                id={headingId}
                description={detail.introduction}
              >
                {detail.heroTitle}
              </SectionHeading>
              {detail.enquiryAction ? (
                <p className="mt-8 m-0">
                  <ButtonLink
                    href={detail.enquiryAction.href}
                    variant="primary"
                    newTab={detail.enquiryAction.href.startsWith("https://")}
                  >
                    {detail.enquiryAction.label}
                  </ButtonLink>
                </p>
              ) : null}
            </div>

            <div className="flex min-w-0 flex-col gap-8">
              {detail.heroVisual === "browser-frame" ? (
                <ServiceHeroBrowserVisual />
              ) : null}
              {detail.heroVisual === "device-pair" ? (
                <ServiceHeroDevicePairVisual />
              ) : null}
              {detail.heroVisual === "ops-summary" ? (
                <ServiceHeroOpsSummaryVisual />
              ) : null}
              {detail.heroVisual === "review-workflow" ? (
                <ServiceHeroReviewWorkflowVisual />
              ) : null}
              {detail.heroVisual === "modules-link" ? (
                <ServiceHeroModulesLinkVisual />
              ) : null}

              {showContents ? (
                <nav
                  aria-label="On this page"
                  className="min-w-0 text-sm text-text-muted"
                >
                  <p className="m-0 font-semibold text-ink">On this page</p>
                  <ol className="mt-3 list-none space-y-2 p-0">
                    {detail.sectionIds
                      .filter((id) => id !== "hero" && id !== "enquire")
                      .map((id) => (
                        <li key={id}>
                          <TextLink href={`#${sid(idPrefix, id)}`}>
                            {sectionLabel(id)}
                          </TextLink>
                        </li>
                      ))}
                  </ol>
                </nav>
              ) : null}
            </div>
          </div>
        </Container>
      </Section>

      {(detail.audienceItems.length > 0 || detail.problemItems.length > 0) && (
        <Section
          as="section"
          surface="muted"
          id={sid(idPrefix, "who-it-suits")}
          aria-labelledby={sid(idPrefix, "who-it-suits-heading")}
        >
          <Container width="reading">
            <SectionHeading
              level={headingLevel === 1 ? 2 : 3}
              visualLevel={2}
              id={sid(idPrefix, "who-it-suits-heading")}
            >
              Who it suits
            </SectionHeading>
            {detail.audienceItems.length > 0 ? (
              <ul className="mt-6 list-disc space-y-2 pl-5 text-text-body">
                {detail.audienceItems.map((item) => (
                  <li key={item.id}>{item.text}</li>
                ))}
              </ul>
            ) : null}
            {detail.problemItems.length > 0 ? (
              <>
                <h3
                  className="ds-h3 mt-8 m-0"
                  id={sid(idPrefix, "problems-heading")}
                >
                  Problems we help with
                </h3>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-text-body">
                  {detail.problemItems.map((item) => (
                    <li key={item.id}>{item.text}</li>
                  ))}
                </ul>
              </>
            ) : null}
          </Container>
        </Section>
      )}

      {detail.scopeOptions.length > 0 ? (
        <Section
          as="section"
          surface="light"
          id={sid(idPrefix, "scope-options")}
          aria-labelledby={sid(idPrefix, "scope-options-heading")}
        >
          <Container>
            <SectionHeading
              level={headingLevel === 1 ? 2 : 3}
              visualLevel={2}
              id={sid(idPrefix, "scope-options-heading")}
              description="These are scoping options for discussion — not fixed packages. Exact inclusions are agreed in the proposal."
            >
              Scope options
            </SectionHeading>
            <ul className="mt-10 grid list-none gap-8 p-0 lg:grid-cols-2">
              {detail.scopeOptions.map((option) => (
                <li
                  key={option.id}
                  className="min-w-0 border-t border-border-subtle pt-6"
                >
                  <h3 className="ds-h3 m-0">{option.title}</h3>
                  <p className="mt-3 m-0 text-text-body">{option.purpose}</p>
                  {option.examples.length > 0 ? (
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-text-body">
                      {option.examples.map((example) => (
                        <li key={example}>{example}</li>
                      ))}
                    </ul>
                  ) : null}
                  <p className="mt-3 m-0 text-sm text-text-muted">
                    <span className="font-semibold text-ink">
                      Not automatic.{" "}
                    </span>
                    {option.notIncluded}
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {detail.deliverableGroups.length > 0 ? (
        <Section
          as="section"
          surface="muted"
          id={sid(idPrefix, "deliverables")}
          aria-labelledby={sid(idPrefix, "deliverables-heading")}
        >
          <Container>
            <SectionHeading
              level={headingLevel === 1 ? 2 : 3}
              visualLevel={2}
              id={sid(idPrefix, "deliverables-heading")}
            >
              What you may receive
            </SectionHeading>
            <ul className="mt-10 grid list-none gap-8 p-0 lg:grid-cols-2">
              {detail.deliverableGroups.map((group) => (
                <li key={group.id} className="min-w-0">
                  <h3 className="m-0 text-base font-semibold text-ink">
                    {group.title}
                  </h3>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-text-body">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {detail.illustrativeExample ? (
        <Section
          as="section"
          surface="light"
          id={sid(idPrefix, "example")}
          aria-labelledby={sid(idPrefix, "example-heading")}
        >
          <Container width="reading">
            <p className="m-0 text-sm font-medium text-text-muted">
              {detail.illustrativeExample.label}
            </p>
            <SectionHeading
              level={headingLevel === 1 ? 2 : 3}
              visualLevel={2}
              id={sid(idPrefix, "example-heading")}
              description={detail.illustrativeExample.description}
            >
              {detail.illustrativeExample.title}
            </SectionHeading>
            {detail.illustrativeExample.points.length > 0 ? (
              <ul className="mt-6 list-disc space-y-2 pl-5 text-text-body">
                {detail.illustrativeExample.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            ) : null}
            {detail.illustrativeExample.visualVariant ===
            "websites-catalogue-comparison" ? (
              <WebsitesCatalogueComparison />
            ) : null}
            {detail.illustrativeExample.visualVariant ===
            "web-mobile-task-comparison" ? (
              <WebMobileTaskComparison />
            ) : null}
            {detail.illustrativeExample.visualVariant ===
            "business-ops-panel" ? (
              <BusinessOpsPanel />
            ) : null}
            {detail.illustrativeExample.visualVariant ===
            "ai-automation-workflow" ? (
              <AiAutomationWorkflow />
            ) : null}
            {detail.illustrativeExample.visualVariant ===
            "custom-software-guide" ? (
              <CustomSoftwareGuide />
            ) : null}
          </Container>
        </Section>
      ) : null}

      {detail.relatedWork.length > 0 ? (
        <Section
          as="section"
          surface="muted"
          id={sid(idPrefix, "related-work")}
          aria-labelledby={sid(idPrefix, "related-work-heading")}
        >
          <Container width="reading">
            <SectionHeading
              level={headingLevel === 1 ? 2 : 3}
              visualLevel={2}
              id={sid(idPrefix, "related-work-heading")}
            >
              Related work
            </SectionHeading>
            <ul className="mt-6 list-none space-y-4 p-0">
              {detail.relatedWork.map((item) => (
                <li key={item.id}>
                  {item.href ? (
                    <TextLink href={item.href}>{item.title}</TextLink>
                  ) : (
                    <span className="font-medium text-ink">{item.title}</span>
                  )}
                  <span className="mt-1 block text-sm text-text-muted">
                    {item.workStatusLabel}
                  </span>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {detail.deliveryStages.length > 0 ? (
        <Section
          as="section"
          surface="light"
          id={sid(idPrefix, "delivery")}
          aria-labelledby={sid(idPrefix, "delivery-heading")}
        >
          <Container width="reading">
            <SectionHeading
              level={headingLevel === 1 ? 2 : 3}
              visualLevel={2}
              id={sid(idPrefix, "delivery-heading")}
            >
              How delivery usually works
            </SectionHeading>
            <ol className="mt-8 list-none space-y-6 p-0">
              {detail.deliveryStages.map((stage, index) => (
                <li key={stage.id} className="min-w-0">
                  <p className="m-0 text-sm font-medium text-text-muted">
                    Step {index + 1}
                  </p>
                  <h3 className="ds-h3 mt-1 m-0">{stage.title}</h3>
                  <p className="mt-2 m-0 text-text-body">{stage.description}</p>
                </li>
              ))}
            </ol>
          </Container>
        </Section>
      ) : null}

      {detail.clientInputs.length > 0 ? (
        <Section
          as="section"
          surface="muted"
          id={sid(idPrefix, "inputs")}
          aria-labelledby={sid(idPrefix, "inputs-heading")}
        >
          <Container width="reading">
            <SectionHeading
              level={headingLevel === 1 ? 2 : 3}
              visualLevel={2}
              id={sid(idPrefix, "inputs-heading")}
            >
              What we need from you
            </SectionHeading>
            <ul className="mt-6 list-disc space-y-2 pl-5 text-text-body">
              {detail.clientInputs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {(detail.boundaries.length > 0 ||
        detail.recurringCostNotes.length > 0) && (
        <Section
          as="section"
          surface="light"
          id={sid(idPrefix, "boundaries")}
          aria-labelledby={sid(idPrefix, "boundaries-heading")}
        >
          <Container width="reading">
            <SectionHeading
              level={headingLevel === 1 ? 2 : 3}
              visualLevel={2}
              id={sid(idPrefix, "boundaries-heading")}
            >
              Boundaries and ongoing costs
            </SectionHeading>
            {detail.boundaries.length > 0 ? (
              <ul className="mt-6 list-disc space-y-2 pl-5 text-text-body">
                {detail.boundaries.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {detail.recurringCostNotes.length > 0 ? (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-text-body">
                {detail.recurringCostNotes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </Container>
        </Section>
      )}

      {detail.faqs.length > 0 ? (
        <Section
          as="section"
          surface="muted"
          id={sid(idPrefix, "faqs")}
          aria-labelledby={sid(idPrefix, "faqs-heading")}
        >
          <Container width="reading">
            <SectionHeading
              level={headingLevel === 1 ? 2 : 3}
              visualLevel={2}
              id={sid(idPrefix, "faqs-heading")}
            >
              Questions
            </SectionHeading>
            <div className="mt-8">
              {detail.faqs.map((faq) => (
                <FaqDisclosure
                  key={faq.id}
                  id={sid(idPrefix, faq.id)}
                  question={faq.question}
                >
                  <p className="m-0 text-wrap">{faq.answer}</p>
                </FaqDisclosure>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {detail.relatedServices.length > 0 ? (
        <Section
          as="section"
          surface="light"
          id={sid(idPrefix, "related-services")}
          aria-labelledby={sid(idPrefix, "related-services-heading")}
        >
          <Container width="reading">
            <SectionHeading
              level={headingLevel === 1 ? 2 : 3}
              visualLevel={2}
              id={sid(idPrefix, "related-services-heading")}
            >
              Related services
            </SectionHeading>
            <ul className="mt-6 list-none space-y-4 p-0">
              {detail.relatedServices.map((item) => (
                <li key={item.id} className="min-w-0">
                  {item.href ? (
                    <TextLink href={item.href}>{item.title}</TextLink>
                  ) : (
                    <span className="font-medium text-ink">{item.title}</span>
                  )}
                  <p className="mt-1 m-0 text-sm text-text-body">
                    {item.summary}
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {detail.enquiryAction ? (
        <Section
          as="section"
          surface="muted"
          id={sid(idPrefix, "enquire")}
          aria-labelledby={sid(idPrefix, "enquire-heading")}
        >
          <Container width="reading">
            <SectionHeading
              level={headingLevel === 1 ? 2 : 3}
              visualLevel={2}
              id={sid(idPrefix, "enquire-heading")}
              description="Share the business need you want to improve. Exact scope is agreed after we understand your situation."
            >
              Next step
            </SectionHeading>
            <p className="mt-8 m-0">
              <ButtonLink
                href={detail.enquiryAction.href}
                variant="primary"
                newTab={detail.enquiryAction.href.startsWith("https://")}
              >
                {detail.enquiryAction.label}
              </ButtonLink>
            </p>
            {(detail.enquiryAction.href.startsWith("mailto:") ||
              detail.enquiryAction.href.startsWith("https://wa.me/")) && (
              <p className="mt-4 m-0 text-sm text-text-muted">
                Opening email or WhatsApp starts a conversation. It does not
                submit an enquiry form or book a meeting.
              </p>
            )}
          </Container>
        </Section>
      ) : null}
    </div>
  );
}

function sectionLabel(id: string): string {
  switch (id) {
    case "who-it-suits":
      return "Who it suits";
    case "scope-options":
      return "Scope options";
    case "deliverables":
      return "Deliverables";
    case "example":
      return "Example";
    case "related-work":
      return "Related work";
    case "delivery":
      return "Delivery";
    case "inputs":
      return "Inputs";
    case "boundaries":
      return "Boundaries";
    case "faqs":
      return "Questions";
    case "related-services":
      return "Related services";
    default:
      return id;
  }
}
