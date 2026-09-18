import type { Metadata } from "next";
import { ProcessPage } from "@/components/sections/process-page";
import { Container } from "@/components/ui/container";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublicProcessPage } from "@/server/process";

export const metadata: Metadata = {
  title: "Process — Zatroz",
  description:
    "How Zatroz works with clients — from first conversation through design, build, launch, and handover.",
};

/**
 * Public Process route. While page copy stays draft, shows an honest sparse
 * placeholder; full draft lives in `/dev/ui`.
 */
export default function ProcessRoute() {
  const process = getPublicProcessPage();

  if (process) {
    return <ProcessPage process={process} headingLevel={1} />;
  }

  return (
    <Section as="section" surface="light" aria-labelledby="process-heading">
      <Container width="reading">
        <PageBreadcrumb
          className="mb-8"
          items={[{ label: "Home", href: "/" }, { label: "Process" }]}
        />
        <SectionHeading level={1} visualLevel={2} id="process-heading">
          Process
        </SectionHeading>
        <p className="mt-4">
          The How We Work page is prepared for review in the local gallery.
          Proposed stages, collaboration guidance, and FAQs stay draft until
          founders approve them, so this public page does not publish that
          wording yet.
        </p>
        <p className="mt-4">
          When approved, this page will explain how we move from the first
          conversation to a useful launch — without fixed turnaround promises or
          free unlimited support claims.
        </p>
      </Container>
    </Section>
  );
}
