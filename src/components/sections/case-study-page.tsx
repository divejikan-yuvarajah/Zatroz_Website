import {
  CaseStudyFacts,
  CaseStudyHero,
} from "@/components/sections/case-study-hero";
import {
  CaseStudyGallery,
  CaseStudySection,
} from "@/components/sections/case-study-section";
import { ProjectCard } from "@/components/sections/project-card";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { Section } from "@/components/ui/section";
import { TextLink } from "@/components/ui/text-link";
import type { PublicCta } from "@/content/home";
import type { PublicCaseStudy } from "@/lib/public-case-study";
import { cn } from "@/lib/cn";

export type CaseStudyPageProps = {
  study: PublicCaseStudy;
  enquiryAction: PublicCta | null;
  headingLevel?: 1 | 2;
  idPrefix?: string;
  className?: string;
  showBreadcrumb?: boolean;
};

/**
 * Reusable project case-study template. Server Component.
 * Renders only sections present on the public DTO — no empty headings.
 */
export function CaseStudyPage({
  study,
  enquiryAction,
  headingLevel = 1,
  idPrefix = "",
  className,
  showBreadcrumb = true,
}: CaseStudyPageProps) {
  const tocSections = study.sections.filter(
    (section) =>
      section.key === "gallery" ||
      section.blocks.length > 0 ||
      (section.features && section.features.length > 0),
  );
  const showToc = tocSections.length >= 4;

  return (
    <div className={cn(className)}>
      <Section
        as="section"
        surface="light"
        aria-labelledby={`${idPrefix}hero-heading`}
      >
        <Container>
          {showBreadcrumb ? (
            <PageBreadcrumb
              className="mb-8"
              items={[
                { label: "Home", href: "/" },
                { label: "Work", href: "/work" },
                { label: study.title },
              ]}
            />
          ) : null}

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(12rem,16rem)] lg:items-start lg:gap-16">
            <CaseStudyHero
              study={study}
              headingLevel={headingLevel}
              idPrefix={idPrefix}
            />

            {showToc ? (
              <nav
                aria-label="On this page"
                className="min-w-0 text-sm text-text-muted lg:sticky lg:top-28"
              >
                <p className="m-0 font-semibold text-ink">On this page</p>
                <ol className="mt-3 list-none space-y-2 p-0">
                  {tocSections.map((section) => (
                    <li key={section.key}>
                      <a
                        href={`#${section.anchorId}`}
                        className="font-medium text-brand-strong underline decoration-from-font underline-offset-2"
                      >
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            ) : null}
          </div>
        </Container>
      </Section>

      <Section as="section" surface="muted" aria-label="Project facts">
        <Container width="reading">
          <CaseStudyFacts study={study} />
        </Container>
      </Section>

      <Section as="div" surface="light">
        <Container width="reading" className="space-y-14">
          {study.sections.map((section) => {
            if (section.key === "gallery") {
              return (
                <CaseStudyGallery
                  key={section.key}
                  items={study.gallery}
                  anchorId={section.anchorId}
                  headingId={`${section.anchorId}-heading`}
                />
              );
            }
            if (section.key === "testimonial" && study.testimonial) {
              return (
                <section
                  key={section.key}
                  id={section.anchorId}
                  aria-labelledby={`${section.anchorId}-heading`}
                  className="scroll-mt-28"
                >
                  <h2 id={`${section.anchorId}-heading`} className="ds-h2 m-0">
                    {section.heading}
                  </h2>
                  <blockquote className="mt-4 m-0 border-l-2 border-brand pl-5">
                    <p className="m-0 text-lg text-text-body">
                      {study.testimonial.quote}
                    </p>
                    <footer className="mt-3 text-sm text-text-muted">
                      {study.testimonial.attribution}
                    </footer>
                  </blockquote>
                </section>
              );
            }
            return <CaseStudySection key={section.key} section={section} />;
          })}

          {study.links.length > 0 ? (
            <div>
              <h2 className="ds-h3 m-0">Links</h2>
              <ul className="mt-4 list-none space-y-2 p-0">
                {study.links.map((link) => (
                  <li key={link.href}>
                    <TextLink
                      href={link.href}
                      newTab={link.href.startsWith("https://")}
                    >
                      {link.label}
                    </TextLink>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Container>
      </Section>

      {study.related.length > 0 ? (
        <Section
          as="section"
          surface="muted"
          aria-labelledby={`${idPrefix}related-heading`}
        >
          <Container>
            <h2 id={`${idPrefix}related-heading`} className="ds-h2 m-0">
              Related work
            </h2>
            <ul className="mt-8 grid list-none gap-10 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {study.related.map((project) => (
                <li key={project.id} className="min-w-0">
                  <ProjectCard
                    project={project}
                    headingLevel={3}
                    idPrefix={`${idPrefix}related-`}
                  />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <Section as="section" surface="light" aria-label="Next steps">
        <Container width="reading">
          <p className="m-0">
            <TextLink href="/work">Back to selected work</TextLink>
          </p>
          {enquiryAction ? (
            <p className="mt-8 m-0">
              <ButtonLink
                href={enquiryAction.href}
                variant="primary"
                newTab={enquiryAction.href.startsWith("https://")}
              >
                {enquiryAction.label}
              </ButtonLink>
            </p>
          ) : null}
        </Container>
      </Section>
    </div>
  );
}
