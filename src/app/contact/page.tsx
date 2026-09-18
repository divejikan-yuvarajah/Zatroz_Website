import type { Metadata } from "next";
import { ContactPage } from "@/components/sections/contact-page";
import { Container } from "@/components/ui/container";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { parseContactServiceParam } from "@/lib/contact-service-query";
import { getPublicContactPage } from "@/server/contact";

type ContactRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact — Zatroz",
    description:
      "Contact Zatroz by email or WhatsApp to discuss a website, app, system, or design project.",
    // Service query must not create alternate indexable pages.
    alternates: { canonical: "/contact" },
  };
}

/**
 * Public Contact route. Confirmed channels render; framing copy stays gated.
 * Enquiry form is omitted until formSubmissionReady (later steps).
 */
export default async function ContactRoute({
  searchParams,
}: ContactRouteProps) {
  const raw = await searchParams;
  const { service } = parseContactServiceParam(raw);
  const contact = getPublicContactPage(service);

  if (contact) {
    return <ContactPage contact={contact} headingLevel={1} formSlot={null} />;
  }

  return (
    <Section as="section" surface="light" aria-labelledby="contact-heading">
      <Container width="reading">
        <PageBreadcrumb
          className="mb-8"
          items={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        />
        <SectionHeading level={1} visualLevel={2} id="contact-heading">
          Contact
        </SectionHeading>
        <p className="mt-4">
          The Contact page is prepared, but no confirmed email or WhatsApp
          channel is available to publish yet. Direct contact details appear
          here once founders confirm them.
        </p>
      </Container>
    </Section>
  );
}
