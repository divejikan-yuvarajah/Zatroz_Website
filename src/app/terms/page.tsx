import type { Metadata } from "next";
import { PolicyPage } from "@/components/sections/policy-page";
import { Container } from "@/components/ui/container";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublicTermsPage } from "@/server/legal-policies";
import { buildPublicPageMetadata } from "@/server/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const terms = getPublicTermsPage();
  return buildPublicPageMetadata({
    title: terms?.pageTitle ?? "Website terms",
    description:
      terms?.pageDescription ??
      "Terms for using the Zatroz marketing website. Project work is agreed separately. Full terms publish when approved.",
    canonicalPath: "/terms",
    // Draft sparse terms stay non-indexable until approved public content exists.
    indexable: Boolean(terms),
  });
}

/**
 * Public Terms route. While the policy stays draft, shows an honest sparse
 * placeholder; full draft lives in `/dev/ui`.
 */
export default function TermsRoute() {
  const terms = getPublicTermsPage();

  if (terms) {
    return <PolicyPage policy={terms} headingLevel={1} />;
  }

  return (
    <Section as="section" surface="light" aria-labelledby="terms-heading">
      <Container width="reading">
        <PageBreadcrumb
          className="mb-8"
          items={[{ label: "Home", href: "/" }, { label: "Terms" }]}
        />
        <SectionHeading level={1} visualLevel={2} id="terms-heading">
          Website terms
        </SectionHeading>
        <p className="mt-4">
          Website terms of use are prepared for review in the local gallery.
          Proposed wording stays draft until founders approve it and set a real
          effective date, so this public page does not publish that text yet.
        </p>
        <p className="mt-4">
          Sending an enquiry or message does not create a project contract by
          itself. Project scope, fees, and delivery terms are agreed separately
          when both sides choose to proceed.
        </p>
      </Container>
    </Section>
  );
}
