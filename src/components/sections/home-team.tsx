import Image from "next/image";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { TextLink } from "@/components/ui/text-link";
import type { PublicHomePeople, PublicPerson } from "@/content/people";
import { cn } from "@/lib/cn";

export type HomeTeamProps = {
  people: PublicHomePeople;
  headingLevel?: 1 | 2;
  idPrefix?: string;
  className?: string;
};

function PersonProfile({
  person,
  headingLevel = 3,
  idPrefix = "",
}: {
  person: PublicPerson;
  headingLevel?: 2 | 3;
  idPrefix?: string;
}) {
  const HeadingTag = headingLevel === 2 ? "h2" : "h3";
  const titleId = `${idPrefix}${person.id}-name`;

  return (
    <article aria-labelledby={titleId} className="min-w-0 max-w-reading">
      {person.portrait ? (
        <div className="overflow-hidden rounded-md border border-border-subtle bg-surface-muted">
          <Image
            src={person.portrait.src}
            alt={person.portrait.alt}
            width={person.portrait.width}
            height={person.portrait.height}
            sizes="(max-width: 1023px) 100vw, 20vw"
            className="h-auto w-full object-cover object-top"
            unoptimized={person.portrait.src.toLowerCase().endsWith(".svg")}
          />
        </div>
      ) : null}
      <HeadingTag id={titleId} className="ds-h3 mt-4 m-0">
        {person.displayName}
      </HeadingTag>
      <p className="mt-1 m-0 text-sm font-medium text-text-muted">
        {person.role}
      </p>
      <p className="mt-3 m-0 text-text-body">{person.bio}</p>
      {person.links.length > 0 ? (
        <ul className="mt-3 list-none space-y-1 p-0">
          {person.links.map((link) => (
            <li key={`${person.id}-${link.href}`}>
              <TextLink href={link.href} newTab>
                {link.label}
              </TextLink>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

/**
 * Homepage people / company introduction.
 * Server-rendered; layout follows available approved assets honestly.
 */
export function HomeTeam({
  people,
  headingLevel = 2,
  idPrefix = "",
  className,
}: HomeTeamProps) {
  const headingId = `${idPrefix}${people.id}-heading`;
  const sectionId = `${idPrefix}${people.id}`;
  const showProfiles = people.people.length > 0;
  const showTeamPhoto = people.layout === "team-photo" && people.teamPhoto;

  return (
    <Section
      as="section"
      surface="muted"
      id={sectionId}
      aria-labelledby={headingId}
      className={cn(className)}
    >
      <Container>
        <div
          className={cn(
            "grid items-start gap-12",
            showTeamPhoto || showProfiles ? "lg:grid-cols-2 lg:gap-16" : null,
          )}
        >
          <div className="min-w-0 max-w-reading">
            <SectionHeading
              level={headingLevel}
              visualLevel={2}
              id={headingId}
              description={people.companyIntro}
            >
              {people.heading}
            </SectionHeading>
            <p className="mt-4 text-text-body">{people.communicationNote}</p>

            {people.principles.length > 0 ? (
              <ul className="mt-8 list-none space-y-5 p-0">
                {people.principles.map((principle) => (
                  <li key={principle.id} className="min-w-0">
                    <p className="m-0 text-base font-semibold text-ink">
                      {principle.title}
                    </p>
                    <p className="mt-1 m-0 text-sm text-text-body">
                      {principle.description}
                    </p>
                  </li>
                ))}
              </ul>
            ) : null}

            {people.action ? (
              <p className="mt-8 m-0">
                <ButtonLink href={people.action.href} variant="secondary">
                  {people.action.label}
                </ButtonLink>
              </p>
            ) : null}
          </div>

          {showTeamPhoto && people.teamPhoto ? (
            <figure className="m-0 min-w-0">
              <div className="overflow-hidden rounded-md border border-border-subtle bg-surface">
                <Image
                  src={people.teamPhoto.src}
                  alt={people.teamPhoto.alt}
                  width={people.teamPhoto.width}
                  height={people.teamPhoto.height}
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  className="h-auto w-full object-cover object-center"
                  unoptimized={people.teamPhoto.src
                    .toLowerCase()
                    .endsWith(".svg")}
                />
              </div>
              {people.teamPhoto.caption ? (
                <figcaption className="mt-3 text-sm text-text-muted">
                  {people.teamPhoto.caption}
                </figcaption>
              ) : null}
            </figure>
          ) : null}

          {showProfiles && !showTeamPhoto ? (
            <div
              className={cn(
                "min-w-0",
                people.people.length > 1 ? "grid gap-10 sm:grid-cols-2" : null,
              )}
            >
              {people.people.map((person) => (
                <PersonProfile
                  key={person.id}
                  person={person}
                  headingLevel={3}
                  idPrefix={idPrefix}
                />
              ))}
            </div>
          ) : null}
        </div>

        {showProfiles && showTeamPhoto ? (
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {people.people.map((person) => (
              <PersonProfile
                key={person.id}
                person={person}
                headingLevel={3}
                idPrefix={idPrefix}
              />
            ))}
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
