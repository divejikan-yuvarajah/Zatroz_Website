import { ServiceMark } from "@/components/sections/service-mark";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { TextLink } from "@/components/ui/text-link";
import type { PublicServicesOverview } from "@/content/services-overview";
import { cn } from "@/lib/cn";

export type ServicesOverviewProps = {
  overview: PublicServicesOverview;
  headingLevel?: 1 | 2;
  idPrefix?: string;
  className?: string;
  showBreadcrumb?: boolean;
};

/**
 * Services overview composition. Server-rendered; approved content only on public /.
 */
export function ServicesOverview({
  overview,
  headingLevel = 1,
  idPrefix = "",
  className,
  showBreadcrumb = true,
}: ServicesOverviewProps) {
  const headingId = `${idPrefix}${overview.id}-heading`;
  const NeedsHeadingTag = headingLevel === 1 ? "h2" : "h3";
  const RowHeadingTag = headingLevel === 1 ? "h2" : "h3";
  const SubHeadingTag = headingLevel === 1 ? "h3" : "h4";

  return (
    <div className={cn(className)}>
      <Section
        as="section"
        surface="light"
        aria-labelledby={headingId}
        className="pb-section"
      >
        <Container>
          {showBreadcrumb ? (
            <PageBreadcrumb
              className="mb-8"
              items={[{ label: "Home", href: "/" }, { label: "Services" }]}
            />
          ) : null}

          <div className="max-w-reading">
            <SectionHeading
              level={headingLevel}
              visualLevel={1}
              id={headingId}
              description={overview.supporting}
            >
              {overview.heading}
            </SectionHeading>

            {overview.enquiryAction ? (
              <p className="mt-8 m-0">
                <ButtonLink
                  href={overview.enquiryAction.href}
                  variant="primary"
                  newTab={overview.enquiryAction.href.startsWith("https://")}
                >
                  {overview.enquiryAction.label}
                </ButtonLink>
              </p>
            ) : null}
          </div>
        </Container>
      </Section>

      {overview.needs.length > 0 ? (
        <Section
          as="section"
          surface="muted"
          aria-labelledby={`${idPrefix}needs-heading`}
        >
          <Container>
            <SectionHeading
              level={headingLevel === 1 ? 2 : 3}
              visualLevel={2}
              id={`${idPrefix}needs-heading`}
              description={overview.needsSupporting}
            >
              {overview.needsHeading}
            </SectionHeading>

            <ul className="mt-10 grid list-none gap-8 p-0 sm:grid-cols-2">
              {overview.needs.map((need) => (
                <li
                  key={need.id}
                  id={`${idPrefix}${need.id}`}
                  className="min-w-0"
                >
                  <NeedsHeadingTag className="ds-h3 m-0">
                    {need.title}
                  </NeedsHeadingTag>
                  <p className="mt-2 m-0 text-text-body">{need.explanation}</p>
                  {need.serviceAnchors.length > 0 ? (
                    <ul className="mt-4 list-none space-y-2 p-0">
                      {need.serviceAnchors.map((anchor) => (
                        <li key={anchor.id}>
                          <TextLink href={`#${idPrefix}${anchor.anchorId}`}>
                            {anchor.title}
                          </TextLink>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {overview.services.length > 0 ? (
        <Section
          as="section"
          surface="light"
          aria-labelledby={`${idPrefix}services-list-heading`}
        >
          <Container>
            <SectionHeading
              level={headingLevel === 1 ? 2 : 3}
              visualLevel={2}
              id={`${idPrefix}services-list-heading`}
            >
              Service groups
            </SectionHeading>

            <ul className="mt-10 list-none space-y-0 p-0">
              {overview.services.map((service, index) => {
                const titleId = `${idPrefix}${service.anchorId}-title`;
                const isLast = index === overview.services.length - 1;

                return (
                  <li
                    key={service.id}
                    id={`${idPrefix}${service.anchorId}`}
                    className="min-w-0 scroll-mt-[5.75rem]"
                  >
                    <article
                      aria-labelledby={titleId}
                      className="grid gap-6 py-10 lg:grid-cols-[auto_1fr] lg:gap-10"
                    >
                      <ServiceMark slug={service.slug} />
                      <div className="min-w-0 max-w-reading">
                        <RowHeadingTag id={titleId} className="ds-h3 m-0">
                          {service.title}
                        </RowHeadingTag>
                        {service.whoItSuits ? (
                          <p className="mt-3 m-0 text-text-body">
                            <span className="font-semibold text-ink">
                              Who it helps.{" "}
                            </span>
                            {service.whoItSuits}
                          </p>
                        ) : null}
                        <p className="mt-3 m-0 text-text-body">
                          <span className="font-semibold text-ink">
                            Outcome.{" "}
                          </span>
                          {service.outcome}
                        </p>
                        {service.deliverables.length > 0 ? (
                          <>
                            <SubHeadingTag className="mt-5 m-0 text-base font-semibold text-ink">
                              Representative deliverables
                            </SubHeadingTag>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-text-body">
                              {service.deliverables.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </>
                        ) : null}
                        {service.detailAction ? (
                          <p className="mt-6 m-0">
                            <ButtonLink
                              href={service.detailAction.href}
                              variant="secondary"
                              newTab={service.detailAction.href.startsWith(
                                "https://",
                              )}
                            >
                              {service.detailAction.label}
                            </ButtonLink>
                          </p>
                        ) : null}
                      </div>
                    </article>
                    {!isLast ? (
                      <div
                        className="border-b border-border-subtle"
                        aria-hidden="true"
                      />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </Container>
        </Section>
      ) : null}

      {overview.notSureItems.length > 0 ? (
        <Section
          as="section"
          surface="muted"
          aria-labelledby={`${idPrefix}not-sure-heading`}
        >
          <Container width="reading">
            <SectionHeading
              level={headingLevel === 1 ? 2 : 3}
              visualLevel={2}
              id={`${idPrefix}not-sure-heading`}
              description={overview.notSureBody}
            >
              {overview.notSureHeading}
            </SectionHeading>
            <ul className="mt-8 list-none space-y-6 p-0">
              {overview.notSureItems.map((item) => (
                <li key={item.id} className="min-w-0">
                  <p className="m-0 font-semibold text-ink">{item.situation}</p>
                  <p className="mt-2 m-0 text-text-body">{item.guidance}</p>
                  {item.serviceLabels.length > 0 ? (
                    <p className="mt-2 m-0 text-sm text-text-muted">
                      Related: {item.serviceLabels.join(" · ")}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {overview.delivery ? (
        <Section
          as="section"
          surface="light"
          aria-labelledby={`${idPrefix}delivery-heading`}
        >
          <Container width="reading">
            <SectionHeading
              level={headingLevel === 1 ? 2 : 3}
              visualLevel={2}
              id={`${idPrefix}delivery-heading`}
              description={overview.delivery.body}
            >
              {overview.delivery.heading}
            </SectionHeading>
          </Container>
        </Section>
      ) : null}

      {overview.work ? (
        <Section
          as="section"
          surface="muted"
          aria-labelledby={`${idPrefix}work-heading`}
        >
          <Container>
            <SectionHeading
              level={headingLevel === 1 ? 2 : 3}
              visualLevel={2}
              id={`${idPrefix}work-heading`}
              description={overview.work.supporting}
            >
              {overview.work.heading}
            </SectionHeading>
            <ul className="mt-8 list-none space-y-3 p-0">
              {overview.work.items.map((item) => (
                <li key={item.id}>
                  {item.href ? (
                    <TextLink href={item.href}>{item.title}</TextLink>
                  ) : (
                    <span className="text-text-body">{item.title}</span>
                  )}
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {overview.finalAction ? (
        <Section
          as="section"
          surface="light"
          aria-labelledby={`${idPrefix}final-cta-heading`}
        >
          <Container width="reading">
            <SectionHeading
              level={headingLevel === 1 ? 2 : 3}
              visualLevel={2}
              id={`${idPrefix}final-cta-heading`}
              description="Tell us what you need. Scope, timing, and commercial terms are agreed for your project."
            >
              Ready to talk about a project?
            </SectionHeading>
            <p className="mt-8 m-0">
              <ButtonLink
                href={overview.finalAction.href}
                variant="primary"
                newTab={overview.finalAction.href.startsWith("https://")}
              >
                {overview.finalAction.label}
              </ButtonLink>
            </p>
            {(overview.finalAction.href.startsWith("mailto:") ||
              overview.finalAction.href.startsWith("https://wa.me/")) && (
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
