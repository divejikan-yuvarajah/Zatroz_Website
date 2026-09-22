import type { Metadata } from "next";
import { PolicyPage } from "@/components/sections/policy-page";
import { Container } from "@/components/ui/container";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublicPrivacyPage } from "@/server/legal-policies";

export const metadata: Metadata = {
  title: "Privacy — Zatroz",
  description:
    "How the Zatroz website handles enquiry and technical information. Full notice publishes when approved.",
  robots: { index: false, follow: false },
};

/**
 * Public Privacy route. While the policy stays draft, shows an honest sparse
 * placeholder; full draft lives in `/dev/ui`. Unapproved wording is not exposed
 * in public HTML.
 */
export default function PrivacyRoute() {
  const privacy = getPublicPrivacyPage();

  if (privacy) {
    return <PolicyPage policy={privacy} headingLevel={1} />;
  }

  return (
    <Section as="section" surface="light" aria-labelledby="privacy-heading">
      <Container width="reading">
        <PageBreadcrumb
          className="mb-8"
          items={[{ label: "Home", href: "/" }, { label: "Privacy" }]}
        />
        <SectionHeading level={1} visualLevel={2} id="privacy-heading">
          Privacy
        </SectionHeading>
        <p className="mt-4">
          The Privacy notice is prepared for review in the local gallery.
          Proposed wording stays draft until founders approve it and set a real
          effective date, so this public page does not publish that text yet.
        </p>
        <p className="mt-4">
          Until then, information you send by email or WhatsApp is used to
          respond to your enquiry and discuss the project. Do not send
          passwords, payment cards, or confidential customer records through
          those channels.
        </p>
      </Container>
    </Section>
  );
}
