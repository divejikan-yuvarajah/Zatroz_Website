import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { TextLink } from "@/components/ui/text-link";
import { UiInteractions } from "@/components/dev/ui-interactions";
import { FormDemo } from "@/components/dev/form-demo";
import { DesktopNavigationSpecimen } from "@/components/dev/desktop-navigation-specimen";
import { FooterSpecimen } from "@/components/dev/footer-specimen";
import { HomeAutomationExampleSpecimen } from "@/components/dev/home-automation-example-specimen";
import { HomeEvidenceSpecimen } from "@/components/dev/home-evidence-specimen";
import { HomeFeedbackFaqSpecimen } from "@/components/dev/home-feedback-faq-specimen";
import { HomeHeroSpecimen } from "@/components/dev/home-hero-specimen";
import { HomeProcessSpecimen } from "@/components/dev/home-process-specimen";
import { HomeSelectedWorkSpecimen } from "@/components/dev/home-selected-work-specimen";
import { HomeServiceExplorerSpecimen } from "@/components/dev/home-service-explorer-specimen";
import { HomeTeamSpecimen } from "@/components/dev/home-team-specimen";
import { MobileNavigationSpecimen } from "@/components/dev/mobile-navigation-specimen";

export const metadata: Metadata = {
  title: "Design tokens and UI — local preview",
  description:
    "Local Zatroz token and component gallery. Not for production or search.",
  robots: { index: false, follow: false },
};

const swatches: {
  name: string;
  token: string;
  hex: string;
  className: string;
}[] = [
  { name: "Brand", token: "brand", hex: "#FF3B10", className: "bg-brand" },
  {
    name: "Brand hover",
    token: "brand-hover",
    hex: "#FF572E",
    className: "bg-brand-hover",
  },
  {
    name: "Brand strong",
    token: "brand-strong",
    hex: "#C42B0A",
    className: "bg-brand-strong",
  },
  {
    name: "Brand soft",
    token: "brand-soft",
    hex: "#FFF0EA",
    className: "bg-brand-soft",
  },
  { name: "Ink", token: "ink", hex: "#111111", className: "bg-ink" },
  { name: "Canvas", token: "canvas", hex: "#F7F5F2", className: "bg-canvas" },
  {
    name: "Surface",
    token: "surface",
    hex: "#FFFFFF",
    className: "bg-surface",
  },
  {
    name: "Surface muted",
    token: "surface-muted",
    hex: "#EEEAE4",
    className: "bg-surface-muted",
  },
  {
    name: "Surface inverse",
    token: "surface-inverse",
    hex: "#1C1C1C",
    className: "bg-surface-inverse",
  },
  {
    name: "Text body",
    token: "text-body",
    hex: "#3F3D3A",
    className: "bg-text-body",
  },
  {
    name: "Text muted",
    token: "text-muted",
    hex: "#68645F",
    className: "bg-text-muted",
  },
  {
    name: "Success",
    token: "success",
    hex: "#166534",
    className: "bg-success",
  },
  {
    name: "Warning",
    token: "warning",
    hex: "#854D0E",
    className: "bg-warning",
  },
  { name: "Error", token: "error", hex: "#B91C1C", className: "bg-error" },
];

const spaces: { label: string; token: string; className: string }[] = [
  { label: "4px", token: "--space-1", className: "w-1" },
  { label: "8px", token: "--space-2", className: "w-2" },
  { label: "12px", token: "--space-3", className: "w-3" },
  { label: "16px", token: "--space-4", className: "w-4" },
  { label: "24px", token: "--space-5", className: "w-6" },
  { label: "32px", token: "--space-6", className: "w-8" },
  { label: "48px", token: "--space-7", className: "w-12" },
  { label: "64px", token: "--space-8", className: "w-16" },
  { label: "80px", token: "--space-9", className: "w-20" },
  { label: "96px", token: "--space-10", className: "w-24" },
  { label: "128px", token: "--space-11", className: "w-32" },
];

export default function DevUiPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <>
      <div className="bg-canvas text-text-body">
        <div className="mx-auto max-w-container px-gutter py-section">
          <header className="max-w-reading">
            <p className="ds-support mb-3 font-medium">Example · local only</p>
            <h1>Zatroz design tokens</h1>
            <p className="mt-4">
              Token preview for colour, type, spacing, surfaces, and keyboard
              focus. This route is for local development. It is not a marketing
              page and contains no private data.
            </p>
          </header>

          <section className="mt-section" aria-labelledby="colour-heading">
            <h2 id="colour-heading">Colour</h2>
            <ul className="mt-6 grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 md:grid-cols-4">
              {swatches.map((swatch) => (
                <li key={swatch.token}>
                  <figure className="m-0">
                    <div
                      className={`h-16 rounded-md border border-border-subtle ${swatch.className}`}
                    />
                    <figcaption className="ds-support mt-2">
                      <span className="block font-medium text-ink">
                        {swatch.name}
                      </span>
                      {swatch.token} · {swatch.hex}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-section" aria-labelledby="type-heading">
            <h2 id="type-heading">Typography</h2>
            <p className="ds-support mt-2">
              One family (Manrope, with a system fallback). Heading size is
              visual; HTML level stays semantic.
            </p>
            <div className="mt-6 space-y-6">
              <div>
                <p className="ds-support">
                  Display size H1 · ~40–88px · not a second page title
                </p>
                <p className="ds-h1 mt-1">
                  Digital solutions for everyday work
                </p>
              </div>
              <div>
                <p className="ds-support">Display size H2 · ~30–56px</p>
                <p className="ds-h2 mt-1">
                  A long heading should wrap instead of overflowing the viewport
                  or using hardcoded line breaks
                </p>
              </div>
              <div>
                <p className="ds-support">Display size H3 · ~22–32px</p>
                <p className="ds-h3 mt-1">Service groups and delivery steps</p>
              </div>
              <div>
                <p className="ds-support">Body · ~16–18px · line-height 1.6</p>
                <p className="mt-1 max-w-reading">
                  Body copy uses the text-body token on canvas or white
                  surfaces. This paragraph is an example only. It is not a
                  client story or a result claim.
                </p>
              </div>
              <p className="ds-support">Supporting text · ~14px</p>
            </div>
          </section>

          <section className="mt-section" aria-labelledby="space-heading">
            <h2 id="space-heading">Spacing</h2>
            <p className="ds-support mt-2">
              Rem scale at the default root size. Bars are examples, not page
              layout.
            </p>
            <ul className="mt-6 list-none space-y-2 p-0">
              {spaces.map((space) => (
                <li key={space.token} className="flex items-center gap-3">
                  <div
                    className={`h-3 ${space.className} shrink-0 rounded-sm bg-brand`}
                  />
                  <span className="ds-support">
                    {space.label} · {space.token}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-section" aria-labelledby="surface-heading">
            <h2 id="surface-heading">Surfaces</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-md border border-border-subtle bg-surface p-6 text-text-body shadow-soft">
                <h3>Light surface</h3>
                <p className="mt-3">
                  Ink headings and body text on white. Small links use
                  brand-strong, not bright brand orange.
                </p>
                <p className="mt-3">
                  <a
                    className="font-medium text-brand-strong underline"
                    href="#focus-heading"
                  >
                    Example in-page link
                  </a>
                </p>
                <p className="ds-support mt-3">
                  Muted supporting copy on light.
                </p>
              </div>
              <div className="rounded-md bg-ink p-6 text-text-inverse-body">
                <h3 className="text-text-inverse">Charcoal section</h3>
                <p className="mt-3">
                  Inverse body token on ink. Do not reuse light-surface orange
                  links here without a separate check.
                </p>
                <p className="mt-3">
                  <a
                    className="font-medium text-text-inverse underline"
                    href="#focus-heading"
                  >
                    Example inverse link
                  </a>
                </p>
                <p className="mt-3 text-text-inverse-muted">
                  Inverse muted supporting copy.
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-md bg-success-soft p-4 text-success">
              Example success message on success-soft. Not a real enquiry
              result.
            </div>
            <div className="mt-3 rounded-md bg-warning-soft p-4 text-warning">
              Example warning message on warning-soft.
            </div>
            <div className="mt-3 rounded-md bg-error-soft p-4 text-error">
              Example error message on error-soft.
            </div>
          </section>

          <section className="mt-section" aria-labelledby="focus-heading">
            <h2 id="focus-heading">Focus and native controls</h2>
            <p className="ds-support mt-2 max-w-reading">
              Tab through these native controls. They are unstyled examples for
              focus inspection, not the reusable Button or form APIs (later
              steps).
            </p>
            <div className="mt-6 flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="ds-transition rounded-sm bg-brand px-4 py-3 font-medium text-ink"
                >
                  Example primary (dark text on brand)
                </button>
                <button
                  type="button"
                  className="ds-transition rounded-sm bg-surface px-4 py-3 font-medium text-ink ring-1 ring-border-control"
                >
                  Example secondary
                </button>
              </div>
              <div className="rounded-md bg-ink p-6">
                <button
                  type="button"
                  className="rounded-sm bg-surface-inverse px-4 py-3 font-medium text-text-inverse ring-1 ring-border-inverse"
                >
                  Example on charcoal
                </button>
              </div>
              <label className="flex max-w-reading flex-col gap-2 text-ink">
                Example text field
                <input
                  type="text"
                  name="preview-example"
                  autoComplete="off"
                  className="min-h-11 rounded-sm border border-border-control bg-surface px-3 py-2 text-base text-text-body"
                  defaultValue="Example value"
                />
              </label>
              <label className="flex items-center gap-2 text-ink">
                <input type="checkbox" name="preview-check" />
                Example checkbox
              </label>
            </div>
          </section>
        </div>
      </div>

      <Section
        as="section"
        surface="muted"
        aria-labelledby="components-heading"
      >
        <Container>
          <SectionHeading
            level={2}
            id="components-heading"
            eyebrow="Example · local only"
            description="Reusable primitives for later pages. Labels are examples, not client proof."
          >
            Components
          </SectionHeading>

          <h3 className="mt-10">Buttons and links</h3>
          <p className="ds-support mt-2 max-w-reading">
            Primary uses ink on brand. Secondary and quiet are for light
            surfaces only. Links go to this page, home, or in-page targets.
          </p>
          <div className="mt-6 flex max-w-xl flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="quiet">Quiet</Button>
            <Button size="compact">Compact</Button>
            <Button variant="secondary" size="compact">
              Compact secondary
            </Button>
            <Button loading>Wide loading label stays this width</Button>
            <Button disabled>Disabled</Button>
          </div>
          <p className="mt-6 max-w-xl">
            Long label wrap example:{" "}
            <Button className="mt-2">
              A deliberately long action label that must wrap on a narrow screen
              without being clipped
            </Button>
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/">Home (button link)</ButtonLink>
            <ButtonLink href="#components-heading" variant="secondary">
              In-page target
            </ButtonLink>
          </div>
          <p className="mt-6 max-w-reading">
            Body text with a <TextLink href="/">text link to home</TextLink> and
            another{" "}
            <TextLink href="#colour-heading">in-page text link</TextLink>.
          </p>
          <UiInteractions />
        </Container>
      </Section>

      <Section
        as="section"
        surface="dark"
        aria-labelledby="dark-components-heading"
      >
        <Container>
          <SectionHeading
            level={2}
            id="dark-components-heading"
            tone="inverse"
            eyebrow="Example · charcoal"
            description="Inverse text links are supported here. Secondary and quiet buttons are not used on charcoal."
          >
            Dark surface
          </SectionHeading>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button>Primary on charcoal</Button>
            <ButtonLink href="/" variant="primary">
              Button link on charcoal
            </ButtonLink>
          </div>
          <p className="mt-6 max-w-reading">
            Inverse{" "}
            <TextLink href="#components-heading" surface="inverse">
              text link
            </TextLink>{" "}
            on charcoal.
          </p>
        </Container>
      </Section>

      <Section
        as="section"
        surface="light"
        aria-labelledby="badge-card-heading"
      >
        <Container>
          <SectionHeading
            level={2}
            visualLevel={3}
            id="badge-card-heading"
            description="Heading level stays 2; the visual scale is smaller. No empty eyebrow is rendered."
          >
            Badges and cards
          </SectionHeading>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge>Neutral</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="success">Success example</Badge>
            <Badge variant="warning">Warning example</Badge>
            <Badge variant="error">Error example</Badge>
          </div>
          <div className="mt-8 grid min-w-0 gap-6 md:grid-cols-2">
            <Card>
              <h3>Card with a link inside</h3>
              <p className="mt-3">
                The card itself is not clickable.{" "}
                <TextLink href="/">Read the starter home</TextLink>
              </p>
            </Card>
            <Card as="article">
              <h3>Article card</h3>
              <p className="mt-3">
                Example grouping only. No nested buttons inside a wrapping link.
              </p>
            </Card>
          </div>
          <div className="mt-8 min-w-0 max-w-sm">
            <Card>
              <h3>Narrow layout</h3>
              <p className="mt-3">
                Container and card children can shrink. Long words wrap rather
                than forcing horizontal scroll.
              </p>
              <Button className="mt-4">Narrow card action</Button>
            </Card>
          </div>
          <p className="mt-8 max-w-reading">
            Reading-width example: about 65ch. Do not nest a second Container
            inside another Container (that doubles the gutters).
          </p>
        </Container>
      </Section>

      <Section
        as="section"
        surface="light"
        aria-labelledby="form-components-heading"
      >
        <Container>
          <SectionHeading
            level={2}
            id="form-components-heading"
            eyebrow="Example · local only"
            description="Accessible form primitives for a later Contact enquiry. This demo does not send, store, or email anything."
          >
            Form components
          </SectionHeading>
          <div className="mt-10">
            <FormDemo />
          </div>
        </Container>
      </Section>

      <Section
        as="section"
        surface="muted"
        aria-labelledby="layout-specimen-heading"
      >
        <Container>
          <SectionHeading
            level={2}
            id="layout-specimen-heading"
            eyebrow="Example · layout"
            description="Specimen only. Not a marketing page. Check short copy, long wrapping text, and the charcoal band below."
          >
            Layout specimen
          </SectionHeading>
          <p className="mt-6 max-w-reading">
            Short example: this paragraph is brief so a short page can still
            fill a tall window through the shared shell, without a fixed page
            height.
          </p>
          <p className="mt-4 max-w-reading">
            Long example: layout checks need wrapping text. This paragraph is
            filler so you can judge line length, zoom, and scrolling. It is not
            a client story, a result claim, or a service promise. Repeat the
            idea until the block is taller than a phone screen: the document
            should scroll as a whole. Do not clip overflow to hide a layout
            problem. Nested scrolling inside main is not used here.
          </p>
          <p className="mt-4 max-w-reading">
            Another long example: keep grid and flex children able to shrink
            (`min-w-0`). Words wrap. Horizontal scrolling at 320px is a defect
            unless a genuine table or code sample needs it later.
          </p>
        </Container>
      </Section>

      <Section
        as="section"
        surface="light"
        aria-labelledby="layout-reading-heading"
      >
        <Container width="reading">
          <SectionHeading level={2} id="layout-reading-heading">
            Reading-width section
          </SectionHeading>
          <p className="mt-4">
            This inner Container uses the reading width (about 65ch). Gutters
            match the default Container so header, footer, and page content can
            line up later. Do not nest a second Container inside this one.
          </p>
        </Container>
      </Section>

      <Section
        as="section"
        surface="dark"
        aria-labelledby="layout-dark-heading"
      >
        <Container>
          <SectionHeading
            level={2}
            id="layout-dark-heading"
            tone="inverse"
            description="The charcoal background is full-bleed. The inner Container keeps the same horizontal gutters."
          >
            Dark full-width section
          </SectionHeading>
          <p className="mt-4 max-w-reading">
            Example inverse body copy. No prices, testimonials, or invented
            project results.
          </p>
        </Container>
      </Section>

      <Section
        as="section"
        surface="light"
        aria-labelledby="desktop-nav-heading"
      >
        <Container>
          <SectionHeading
            level={2}
            id="desktop-nav-heading"
            eyebrow="Example · local only"
            description="The live header only links to pages that exist today (Home). This specimen shows the full intended bar, including Planned labels."
          >
            Desktop navigation
          </SectionHeading>
          <div className="mt-10">
            <DesktopNavigationSpecimen />
          </div>
        </Container>
      </Section>

      <Section
        as="section"
        surface="muted"
        aria-labelledby="mobile-nav-heading"
      >
        <Container>
          <SectionHeading
            level={2}
            id="mobile-nav-heading"
            eyebrow="Example · local only"
            description="Each specimen has its own Menu button and dialog ids. The live header menu is separate."
          >
            Mobile navigation
          </SectionHeading>
          <div className="mt-10">
            <MobileNavigationSpecimen />
          </div>
        </Container>
      </Section>

      <Section
        as="section"
        surface="light"
        aria-labelledby="footer-specimen-heading"
      >
        <Container>
          <SectionHeading
            level={2}
            id="footer-specimen-heading"
            eyebrow="Example · local only"
            description="Specimens reuse the footer body without a second contentinfo landmark. The live page footer is separate."
          >
            Site footer
          </SectionHeading>
          <div className="mt-10">
            <FooterSpecimen />
          </div>
        </Container>
      </Section>

      <Section
        as="section"
        surface="muted"
        aria-labelledby="home-hero-specimen-heading"
      >
        <Container>
          <SectionHeading
            level={2}
            id="home-hero-specimen-heading"
            eyebrow="Example · local only"
            description="Draft connected-business hero for review. Specimens use H2 and unique id prefixes. Public / does not publish this copy until it is approved."
          >
            Homepage hero
          </SectionHeading>
          <div className="mt-10">
            <HomeHeroSpecimen />
          </div>
        </Container>
      </Section>

      <Section
        as="section"
        surface="light"
        aria-labelledby="home-evidence-specimen-heading"
      >
        <Container>
          <SectionHeading
            level={2}
            id="home-evidence-specimen-heading"
            eyebrow="Example · local only"
            description="Credibility strip layout with labelled gallery fixtures. Fixtures are never public evidence. Public / omits this section until verified claims or an approved intro exist."
          >
            Homepage evidence
          </SectionHeading>
          <div className="mt-10">
            <HomeEvidenceSpecimen />
          </div>
        </Container>
      </Section>

      <Section
        as="section"
        surface="muted"
        aria-labelledby="home-selected-work-specimen-heading"
      >
        <Container>
          <SectionHeading
            level={2}
            id="home-selected-work-specimen-heading"
            eyebrow="Example · local only"
            description="Selected-work layout with labelled gallery fixtures. Public / omits this section until featuredProjectIds resolve to approved projects. Specimen illustration is not a product screenshot."
          >
            Homepage selected work
          </SectionHeading>
          <div className="mt-10">
            <HomeSelectedWorkSpecimen />
          </div>
        </Container>
      </Section>

      <Section
        as="section"
        surface="light"
        aria-labelledby="home-service-explorer-specimen-heading"
      >
        <Container>
          <SectionHeading
            level={2}
            id="home-service-explorer-specimen-heading"
            eyebrow="Example · local only"
            description="Business-need disclosure explorer. Draft need copy for layout review. Public / omits this section until the explorer framing and at least one need are approved."
          >
            Homepage service explorer
          </SectionHeading>
          <div className="mt-10">
            <HomeServiceExplorerSpecimen />
          </div>
        </Container>
      </Section>

      <Section
        as="section"
        surface="muted"
        aria-labelledby="home-automation-specimen-heading"
      >
        <Container>
          <SectionHeading
            level={2}
            id="home-automation-specimen-heading"
            eyebrow="Example · local only"
            description="Charcoal automation illustration with sample invoice and optional manual walkthrough. Public / omits this section until copy is approved. Nothing is uploaded or processed."
          >
            Homepage automation example
          </SectionHeading>
          <div className="mt-10">
            <HomeAutomationExampleSpecimen />
          </div>
        </Container>
      </Section>

      <Section
        as="section"
        surface="light"
        aria-labelledby="home-process-specimen-heading"
      >
        <Container>
          <SectionHeading
            level={2}
            id="home-process-specimen-heading"
            eyebrow="Example · local only"
            description="Calm delivery process with four always-visible steps and customer outputs. Public / omits this section until copy is approved. Not a guarantee of free support or fixed timelines."
          >
            Homepage delivery process
          </SectionHeading>
          <div className="mt-10">
            <HomeProcessSpecimen />
          </div>
        </Container>
      </Section>

      <Section
        as="section"
        surface="muted"
        aria-labelledby="home-team-specimen-heading"
      >
        <Container>
          <SectionHeading
            level={2}
            id="home-team-specimen-heading"
            eyebrow="Example · local only"
            description="Company introduction and working principles. Gallery profile fixtures are labelled specimens — not real founder cards. Public / omits this section until the company introduction is approved."
          >
            Homepage people
          </SectionHeading>
          <div className="mt-10">
            <HomeTeamSpecimen />
          </div>
        </Container>
      </Section>

      <Section
        as="section"
        surface="light"
        aria-labelledby="home-questions-specimen-heading"
      >
        <Container>
          <SectionHeading
            level={2}
            id="home-questions-specimen-heading"
            eyebrow="Example · local only"
            description="Native FAQ disclosures and optional authentic feedback. Specimen quotes are labelled fixtures — not real customers. Public / omits this section until framing and at least one approved FAQ or feedback item are ready."
          >
            Homepage feedback and FAQs
          </SectionHeading>
          <div className="mt-10">
            <HomeFeedbackFaqSpecimen />
          </div>
        </Container>
      </Section>
    </>
  );
}
