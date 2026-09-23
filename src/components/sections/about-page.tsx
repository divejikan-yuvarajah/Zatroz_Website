import Image from "next/image";
import { ProjectCard } from "@/components/sections/project-card";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { TextLink } from "@/components/ui/text-link";
import type { PublicAboutPage } from "@/server/about";
import { cn } from "@/lib/cn";

export type AboutPageProps = {
  about: PublicAboutPage;
  headingLevel?: 1 | 2;
  idPrefix?: string;
  className?: string;
  showBreadcrumb?: boolean;
};

/**
 * About Zatroz page composition. Server Component.
 * Omits empty optional founder profiles; evidence may be a text-only note.
 */
export function AboutPage({
  about,
  headingLevel = 1,
  idPrefix = "",
  className,
  showBreadcrumb = true,
}: AboutPageProps) {
  const heroId = `${idPrefix}about-hero`;
  const headingId = `${idPrefix}about-heading`;

  return (
    <div className={cn(className)}>
      <Section
        as="section"
        surface="light"
        id={heroId}
        aria-labelledby={headingId}
      >
        <Container>
          {showBreadcrumb ? (
            <PageBreadcrumb
              className="mb-8"
              items={[{ label: "Home", href: "/" }, { label: "About" }]}
            />
          ) : null}

          <div className="max-w-reading">
            <SectionHeading
              level={headingLevel}
              visualLevel={1}
              id={headingId}
              description={about.introduction}
            >
              {about.heroTitle}
            </SectionHeading>

            <div className="mt-8 flex flex-wrap gap-3">
              {about.enquiryAction ? (
                <ButtonLink
                  href={about.enquiryAction.href}
                  variant="primary"
                  newTab={about.enquiryAction.href.startsWith("https://")}
                >
                  {about.enquiryAction.label}
                </ButtonLink>
              ) : null}
              {about.workAction ? (
                <ButtonLink href={about.workAction.href} variant="secondary">
                  {about.workAction.label}
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </Container>
      </Section>

      <Section
        as="section"
        surface="muted"
        id={`${idPrefix}company-story`}
        aria-labelledby={`${idPrefix}company-story-heading`}
      >
        <Container width="reading">
          <h2 id={`${idPrefix}company-story-heading`} className="ds-h2 m-0">
            Our story
          </h2>
          <div className="mt-6 space-y-4">
            {about.companyStory.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="m-0 text-text-body">
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </Section>

      {about.mission || about.vision ? (
        <Section
          as="section"
          surface="light"
          id={`${idPrefix}mission-vision`}
          aria-labelledby={`${idPrefix}mission-vision-heading`}
        >
          <Container width="reading">
            <h2 id={`${idPrefix}mission-vision-heading`} className="ds-h2 m-0">
              Mission and vision
            </h2>
            <div className="mt-8 space-y-8">
              {about.mission ? (
                <div>
                  <h3 className="ds-h3 m-0">Mission</h3>
                  <p className="mt-3 m-0 text-text-body">
                    {about.mission.text}
                  </p>
                </div>
              ) : null}
              {about.vision ? (
                <div>
                  <h3 className="ds-h3 m-0">Vision</h3>
                  <p className="mt-3 m-0 text-text-body">{about.vision.text}</p>
                </div>
              ) : null}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section
        as="section"
        surface="muted"
        id={`${idPrefix}team`}
        aria-labelledby={`${idPrefix}team-heading`}
      >
        <Container>
          <div className="max-w-reading">
            <h2 id={`${idPrefix}team-heading`} className="ds-h2 m-0">
              {about.teamHeading}
            </h2>
            <p className="mt-4 m-0 text-text-body">{about.teamSupporting}</p>
          </div>

          {about.founders.length > 0 ? (
            <ul
              className={cn(
                "mt-10 grid list-none gap-10 p-0",
                about.founders.length === 1
                  ? "max-w-reading"
                  : "sm:grid-cols-2 lg:grid-cols-3",
              )}
            >
              {about.founders.map((person) => (
                <li key={person.id} className="min-w-0">
                  <article aria-labelledby={`${idPrefix}${person.id}-name`}>
                    {person.portrait ? (
                      <div className="mb-4 overflow-hidden rounded-md border border-border-subtle bg-surface-muted">
                        <Image
                          src={person.portrait.src}
                          alt={person.portrait.alt}
                          width={person.portrait.width}
                          height={person.portrait.height}
                          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 20vw"
                          className="h-auto w-full object-cover object-top"
                          unoptimized={person.portrait.src
                            .toLowerCase()
                            .endsWith(".svg")}
                        />
                      </div>
                    ) : null}
                    <h3
                      id={`${idPrefix}${person.id}-name`}
                      className="ds-h3 m-0"
                    >
                      {person.displayName}
                    </h3>
                    <p className="mt-1 m-0 text-sm font-medium text-text-muted">
                      {person.role}
                    </p>
                    <p className="mt-3 m-0 text-text-body">{person.bio}</p>
                    {person.links.length > 0 ? (
                      <ul className="mt-4 list-none space-y-2 p-0">
                        {person.links.map((link) => (
                          <li key={link.href}>
                            <TextLink href={link.href} newTab>
                              {link.label}
                            </TextLink>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </article>
                </li>
              ))}
            </ul>
          ) : null}
        </Container>
      </Section>

      <Section
        as="section"
        surface="light"
        id={`${idPrefix}values`}
        aria-labelledby={`${idPrefix}values-heading`}
      >
        <Container>
          <div className="max-w-reading">
            <h2 id={`${idPrefix}values-heading`} className="ds-h2 m-0">
              {about.valuesHeading}
            </h2>
            <p className="mt-4 m-0 text-text-body">{about.valuesSupporting}</p>
          </div>
          <ul className="mt-10 grid list-none gap-8 p-0 sm:grid-cols-2">
            {about.values.map((value) => (
              <li key={value.id} className="min-w-0 max-w-reading">
                <h3 className="ds-h3 m-0">{value.title}</h3>
                <p className="mt-3 m-0 text-text-body">{value.behaviour}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section
        as="section"
        surface="muted"
        id={`${idPrefix}evidence`}
        aria-labelledby={`${idPrefix}evidence-heading`}
      >
        <Container>
          <div className="max-w-reading">
            <h2 id={`${idPrefix}evidence-heading`} className="ds-h2 m-0">
              {about.evidenceHeading}
            </h2>
            <p className="mt-4 m-0 text-text-body">
              {about.evidenceSupporting}
            </p>
          </div>

          {about.evidence.length > 0 ? (
            <ul className="mt-10 grid list-none gap-10 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {about.evidence.map((project) => (
                <li key={project.id}>
                  <ProjectCard
                    project={project}
                    headingLevel={3}
                    idPrefix={`${idPrefix}evidence-`}
                  />
                </li>
              ))}
            </ul>
          ) : about.workAction ? (
            <p className="mt-6 m-0 max-w-reading">
              <TextLink href={about.workAction.href}>
                {about.workAction.label}
              </TextLink>
            </p>
          ) : null}
        </Container>
      </Section>

      <Section
        as="section"
        surface="light"
        id={`${idPrefix}direction`}
        aria-labelledby={`${idPrefix}direction-heading`}
      >
        <Container width="reading">
          <h2 id={`${idPrefix}direction-heading`} className="ds-h2 m-0">
            {about.directionHeading}
          </h2>
          <p className="mt-4 m-0 text-text-body">{about.directionNote}</p>
        </Container>
      </Section>

      {about.enquiryAction ? (
        <Section
          as="section"
          surface="muted"
          id={`${idPrefix}enquire`}
          aria-labelledby={`${idPrefix}enquire-heading`}
        >
          <Container width="reading">
            <h2 id={`${idPrefix}enquire-heading`} className="ds-h2 m-0">
              Work with us
            </h2>
            <p className="mt-4 m-0 text-text-body">
              Tell us what you need to accomplish. We reply with a clear next
              step — not a packaged price list on this page.
            </p>
            <p className="mt-8 m-0">
              <ButtonLink
                href={about.enquiryAction.href}
                variant="primary"
                newTab={about.enquiryAction.href.startsWith("https://")}
              >
                {about.enquiryAction.label}
              </ButtonLink>
            </p>
          </Container>
        </Section>
      ) : null}
    </div>
  );
}
