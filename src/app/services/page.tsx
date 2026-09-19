import type { Metadata } from "next";
import { ServicesOverview } from "@/components/sections/services-overview";
import { Container } from "@/components/ui/container";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublicServicesOverview } from "@/server/services";

export const metadata: Metadata = {
  title: "Services — Zatroz",
  description:
    "Compare Zatroz service groups for websites, applications, business systems, automation, custom software, and UI/UX design.",
};

export default async function ServicesPage() {
  const overview = await getPublicServicesOverview();

  if (overview) {
    return <ServicesOverview overview={overview} headingLevel={1} />;
  }

  return (
    <Section as="section" surface="light" aria-labelledby="services-heading">
      <Container width="reading">
        <PageBreadcrumb
          className="mb-8"
          items={[{ label: "Home", href: "/" }, { label: "Services" }]}
        />
        <SectionHeading level={1} visualLevel={2} id="services-heading">
          Services
        </SectionHeading>
        <p className="mt-4">
          The Services overview is prepared for review in the local gallery.
          Proposed service copy stays draft until founders approve it, so this
          public page does not publish that wording yet.
        </p>
      </Container>
    </Section>
  );
}
