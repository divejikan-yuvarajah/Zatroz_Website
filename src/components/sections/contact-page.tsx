import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { FaqDisclosure } from "@/components/ui/faq-disclosure";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { TextLink } from "@/components/ui/text-link";
import type { PublicContactPage } from "@/server/contact";
import { cn } from "@/lib/cn";

export type ContactPageProps = {
  contact: PublicContactPage;
  headingLevel?: 1 | 2;
  idPrefix?: string;
  className?: string;
  showBreadcrumb?: boolean;
  /** Optional form slot — public route must pass null until submission-ready. */
  formSlot?: ReactNode;
};

/**
 * Contact page composition. Server Component.
 * Actions resolve to external channels only — never back to /contact.
 */
export function ContactPage({
  contact,
  headingLevel = 1,
  idPrefix = "",
  className,
  showBreadcrumb = true,
  formSlot = null,
}: ContactPageProps) {
  const headingId = `${idPrefix}contact-heading`;

  return (
    <div className={cn(className)}>
      <Section
        as="section"
        surface="light"
        id={`${idPrefix}contact-intro`}
        aria-labelledby={headingId}
      >
        <Container>
          {showBreadcrumb ? (
            <PageBreadcrumb
              className="mb-8"
              items={[{ label: "Home", href: "/" }, { label: "Contact" }]}
            />
          ) : null}

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start">
            <div className="min-w-0 max-w-reading">
              <SectionHeading
                level={headingLevel}
                visualLevel={1}
                id={headingId}
                description={contact.introduction}
              >
                {contact.heroTitle}
              </SectionHeading>

              {contact.serviceContext ? (
                <p className="mt-4 m-0 text-sm font-medium text-text-muted">
                  Interested in {contact.serviceContext.title}
                </p>
              ) : null}
            </div>

            <div className="min-w-0" id={`${idPrefix}contact-methods`}>
              <h2 className="ds-h3 m-0">{contact.methodsHeading}</h2>
              <p className="mt-3 m-0 text-sm text-text-body">
                {contact.methodsSupporting}
              </p>

              {contact.methods.length > 0 ? (
                <ul className="mt-6 list-none space-y-6 p-0">
                  {contact.methods.map((method) => (
                    <li key={method.id} className="min-w-0">
                      <p className="m-0 text-sm font-semibold text-ink">
                        {method.label}
                      </p>
                      <p className="mt-1 m-0 break-words text-text-body">
                        {method.detail}
                      </p>
                      <p className="mt-3 m-0">
                        <ButtonLink
                          href={method.href}
                          variant={
                            method.kind === "email" ? "primary" : "secondary"
                          }
                          newTab={method.href.startsWith("https://")}
                        >
                          {method.actionLabel}
                        </ButtonLink>
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 m-0 text-text-body">
                  Direct contact channels are not confirmed yet. Check back
                  shortly, or use the local gallery while channels are prepared.
                </p>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {contact.includeItems.length > 0 ? (
        <Section
          as="section"
          surface="muted"
          id={`${idPrefix}contact-include`}
          aria-labelledby={`${idPrefix}contact-include-heading`}
        >
          <Container width="reading">
            <h2 id={`${idPrefix}contact-include-heading`} className="ds-h2 m-0">
              {contact.includeHeading}
            </h2>
            <ul className="mt-6 list-disc space-y-2 pl-5 text-text-body">
              {contact.includeItems.map((item) => (
                <li key={item.id}>{item.text}</li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {contact.nextStepsBody ? (
        <Section
          as="section"
          surface="light"
          id={`${idPrefix}contact-next`}
          aria-labelledby={`${idPrefix}contact-next-heading`}
        >
          <Container width="reading">
            <h2 id={`${idPrefix}contact-next-heading`} className="ds-h2 m-0">
              {contact.nextStepsHeading}
            </h2>
            <p className="mt-4 m-0 text-text-body">{contact.nextStepsBody}</p>
          </Container>
        </Section>
      ) : null}

      {contact.dataUseNotice ? (
        <Section
          as="section"
          surface="muted"
          id={`${idPrefix}contact-data`}
          aria-labelledby={`${idPrefix}contact-data-heading`}
        >
          <Container width="reading">
            <h2 id={`${idPrefix}contact-data-heading`} className="ds-h2 m-0">
              {contact.dataUseHeading}
            </h2>
            <p className="mt-4 m-0 text-text-body">{contact.dataUseNotice}</p>
            {contact.privacyHref ? (
              <p className="mt-4 m-0">
                <TextLink href={contact.privacyHref}>Privacy</TextLink>
              </p>
            ) : null}
            {contact.sensitiveNote ? (
              <p className="mt-4 m-0 text-sm text-text-muted">
                {contact.sensitiveNote}
              </p>
            ) : null}
          </Container>
        </Section>
      ) : null}

      {contact.faqs.length > 0 ? (
        <Section
          as="section"
          surface="light"
          id={`${idPrefix}contact-faqs`}
          aria-labelledby={`${idPrefix}contact-faqs-heading`}
        >
          <Container width="reading">
            <h2 id={`${idPrefix}contact-faqs-heading`} className="ds-h2 m-0">
              {contact.faqHeading}
            </h2>
            <div className="mt-8">
              {contact.faqs.map((faq) => (
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
      ) : null}

      {formSlot && contact.formSubmissionReady ? (
        <Section
          as="section"
          surface="muted"
          id={`${idPrefix}contact-form`}
          aria-labelledby={`${idPrefix}contact-form-heading`}
        >
          <Container width="reading">
            <h2 id={`${idPrefix}contact-form-heading`} className="ds-h2 m-0">
              Project enquiry form
            </h2>
            <div className="mt-8">{formSlot}</div>
          </Container>
        </Section>
      ) : null}
    </div>
  );
}
