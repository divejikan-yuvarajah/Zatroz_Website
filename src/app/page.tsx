import { HomeEvidence } from "@/components/sections/home-evidence";
import { HomeHero } from "@/components/sections/home-hero";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublicHomeEvidence, getPublicHomeHero } from "@/server/home";

export default function Home() {
  const hero = getPublicHomeHero();
  const evidence = getPublicHomeEvidence();

  return (
    <>
      {hero ? (
        <HomeHero hero={hero} />
      ) : (
        <Section as="section" surface="light" aria-labelledby="home-heading">
          <Container width="reading">
            <SectionHeading level={1} visualLevel={2} id="home-heading">
              Zatroz
            </SectionHeading>
            <p className="mt-4">
              Development starter for the Zatroz website. The connected-business
              hero and evidence strip are implemented and reviewed in the local
              gallery. Proposed homepage copy and proof items stay draft until
              founders approve them, so this public page does not publish that
              wording or fabricated proof yet.
            </p>
          </Container>
        </Section>
      )}
      {evidence ? <HomeEvidence evidence={evidence} /> : null}
    </>
  );
}
