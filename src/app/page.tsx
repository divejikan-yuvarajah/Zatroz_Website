import { HomeEvidence } from "@/components/sections/home-evidence";
import { HomeFeaturedWork } from "@/components/sections/home-featured-work";
import { HomeHero } from "@/components/sections/home-hero";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getPublicHomeEvidence,
  getPublicHomeHero,
  getPublicSelectedWork,
} from "@/server/home";

export default function Home() {
  const hero = getPublicHomeHero();
  const evidence = getPublicHomeEvidence();
  const selectedWork = getPublicSelectedWork();

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
              Development starter for the Zatroz website. Homepage sections are
              implemented and reviewed in the local gallery. Proposed copy,
              proof items, and project features stay draft or empty until
              founders approve them, so this public page does not publish that
              wording or fabricated work yet.
            </p>
          </Container>
        </Section>
      )}
      {evidence ? <HomeEvidence evidence={evidence} /> : null}
      {selectedWork ? <HomeFeaturedWork selectedWork={selectedWork} /> : null}
    </>
  );
}
