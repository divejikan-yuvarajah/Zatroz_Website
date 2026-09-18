import { HomeAutomationExample } from "@/components/sections/home-automation-example";
import { HomeEvidence } from "@/components/sections/home-evidence";
import { HomeFeaturedWork } from "@/components/sections/home-featured-work";
import { HomeFeedbackFaq } from "@/components/sections/home-feedback-faq";
import { HomeHero } from "@/components/sections/home-hero";
import { HomeProcess } from "@/components/sections/home-process";
import { HomeServiceExplorer } from "@/components/sections/home-service-explorer";
import { HomeTeam } from "@/components/sections/home-team";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getPublicAutomationExample,
  getPublicHomeEvidence,
  getPublicHomeHero,
  getPublicHomePeople,
  getPublicHomeProcess,
  getPublicHomeQuestions,
  getPublicSelectedWork,
  getPublicServiceExplorer,
} from "@/server/home";

export default function Home() {
  const hero = getPublicHomeHero();
  const evidence = getPublicHomeEvidence();
  const selectedWork = getPublicSelectedWork();
  const serviceExplorer = getPublicServiceExplorer();
  const automationExample = getPublicAutomationExample();
  const process = getPublicHomeProcess();
  const people = getPublicHomePeople();
  const questions = getPublicHomeQuestions();

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
              implemented and reviewed in the local gallery. Proposed copy and
              section content stay draft or empty until founders approve them,
              so this public page does not publish that wording yet.
            </p>
          </Container>
        </Section>
      )}
      {evidence ? <HomeEvidence evidence={evidence} /> : null}
      {selectedWork ? <HomeFeaturedWork selectedWork={selectedWork} /> : null}
      {serviceExplorer ? (
        <HomeServiceExplorer explorer={serviceExplorer} />
      ) : null}
      {automationExample ? (
        <HomeAutomationExample example={automationExample} />
      ) : null}
      {process ? <HomeProcess process={process} /> : null}
      {people ? <HomeTeam people={people} /> : null}
      {questions ? <HomeFeedbackFaq questions={questions} /> : null}
    </>
  );
}
