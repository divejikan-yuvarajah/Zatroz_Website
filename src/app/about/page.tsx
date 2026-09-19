import type { Metadata } from "next";
import { AboutPage } from "@/components/sections/about-page";
import { Container } from "@/components/ui/container";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublicAboutPage } from "@/server/about";

export const metadata: Metadata = {
  title: "About — Zatroz",
  description:
    "Meet Zatroz — a small software studio helping SMEs with practical digital solutions across design and custom software.",
};

/**
 * Public About route. While page copy stays draft, shows an honest sparse
 * placeholder; full draft lives in `/dev/ui`.
 */
export default async function AboutRoute() {
  const about = await getPublicAboutPage();

  if (about) {
    return <AboutPage about={about} headingLevel={1} />;
  }

  return (
    <Section as="section" surface="light" aria-labelledby="about-heading">
      <Container width="reading">
        <PageBreadcrumb
          className="mb-8"
          items={[{ label: "Home", href: "/" }, { label: "About" }]}
        />
        <SectionHeading level={1} visualLevel={2} id="about-heading">
          About
        </SectionHeading>
        <p className="mt-4">
          The About page is prepared for review in the local gallery. Proposed
          company story, mission, vision, and values stay draft until founders
          approve them, so this public page does not publish that wording yet.
        </p>
      </Container>
    </Section>
  );
}
