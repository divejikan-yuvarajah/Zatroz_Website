import { HomeHero } from "@/components/sections/home-hero";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublicHomeHero } from "@/server/home";

export default function Home() {
  const hero = getPublicHomeHero();

  if (hero) {
    return <HomeHero hero={hero} />;
  }

  return (
    <Section as="section" surface="light" aria-labelledby="home-heading">
      <Container width="reading">
        <SectionHeading level={1} visualLevel={2} id="home-heading">
          Zatroz
        </SectionHeading>
        <p className="mt-4">
          Development starter for the Zatroz website. The connected-business
          hero is implemented and reviewed in the local gallery. Proposed
          homepage copy stays draft until founders approve it, so this public
          page does not publish that wording yet.
        </p>
      </Container>
    </Section>
  );
}
