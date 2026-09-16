import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

export default function Home() {
  return (
    <Section as="section" surface="light" aria-labelledby="home-heading">
      <Container width="reading">
        <SectionHeading level={1} visualLevel={2} id="home-heading">
          Zatroz
        </SectionHeading>
        <p className="mt-4">
          Development starter for the Zatroz website. Planning docs are in{" "}
          <code>docs/</code>. Page design and navigation come in later steps.
        </p>
      </Container>
    </Section>
  );
}
