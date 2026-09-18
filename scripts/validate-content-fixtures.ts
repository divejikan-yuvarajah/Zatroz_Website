/**
 * Synthetic validation fixtures — not part of the live website catalog.
 */
import type { ContentCatalog } from "../src/content/catalog";
import { contentCatalog } from "../src/content/catalog";
import { validateContentCatalog } from "../src/lib/content-validate";

function cloneCatalog(): ContentCatalog {
  return structuredClone(contentCatalog) as ContentCatalog;
}

function expectFails(label: string, catalog: ContentCatalog, code: string) {
  const result = validateContentCatalog(catalog);
  if (result.ok) {
    throw new Error(`${label}: expected failure but catalog passed`);
  }
  if (!result.errors.some((error) => error.code === code)) {
    throw new Error(
      `${label}: expected error code ${code}, got ${result.errors
        .map((error) => error.code)
        .join(", ")}`,
    );
  }
  console.log(`PASS fixture ${label}`);
}

function expectPasses(label: string, catalog: ContentCatalog) {
  const result = validateContentCatalog(catalog);
  if (!result.ok) {
    throw new Error(
      `${label}: expected pass but got ${result.errors
        .map((error) => error.code)
        .join(", ")}`,
    );
  }
  console.log(`PASS fixture ${label}`);
}

export function runFixtureValidations() {
  expectPasses("baseline-catalog", contentCatalog);

  const duplicateSlug = cloneCatalog();
  duplicateSlug.services = [
    ...duplicateSlug.services.slice(0, 5),
    {
      ...duplicateSlug.services[0]!,
      id: "svc-duplicate-slug",
      slug: "websites-ecommerce",
      routeId: "websitesEcommerce",
    },
  ];
  expectFails("duplicate-service-slug", duplicateSlug, "duplicate-slug");

  const unknownProject = cloneCatalog();
  unknownProject.services = unknownProject.services.map((service, index) =>
    index === 0
      ? { ...service, relatedProjectIds: ["project-does-not-exist"] }
      : service,
  );
  expectFails("unknown-project-ref", unknownProject, "unknown-project-ref");

  const badUrl = cloneCatalog();
  badUrl.projects = [
    {
      id: "proj-bad-url",
      slug: "bad-url-example",
      title: "Bad URL example",
      publicationState: "draft",
      workStatus: "prototype",
      contributors: [],
      zatrozContribution: "",
      problem: "",
      approach: "",
      deliverables: [],
      verifiedOutcomes: [],
      mediaIds: [],
      publicLinks: [{ label: "unsafe", href: "javascript:alert(1)" }],
    },
  ];
  expectFails("invalid-project-url", badUrl, "invalid-url");

  const incompleteApproved = cloneCatalog();
  incompleteApproved.services = incompleteApproved.services.map(
    (service, index) =>
      index === 0
        ? {
            ...service,
            publicationState: "approved",
            summary: "",
          }
        : service,
  );
  expectFails(
    "incomplete-approved-service",
    incompleteApproved,
    "approved-missing-field",
  );

  const incompleteEvidence = cloneCatalog();
  incompleteEvidence.evidence = [
    {
      id: "evidence-incomplete",
      claim: "",
      kind: "project-demo",
      subject: { type: "project", label: "Example" },
      sourceReference: "internal note",
      supportingLabel: "Prototype",
      linkLabel: null,
      href: null,
      publicationState: "approved",
    },
  ];
  expectFails(
    "incomplete-approved-evidence",
    incompleteEvidence,
    "approved-missing-field",
  );

  const badEvidenceUrl = cloneCatalog();
  badEvidenceUrl.evidence = [
    {
      id: "evidence-bad-url",
      claim: "A verified claim for fixture testing",
      kind: "project-demo",
      subject: { type: "project", label: "Example project" },
      sourceReference: "internal verification note",
      supportingLabel: "Prototype",
      linkLabel: "View prototype",
      href: "javascript:alert(1)",
      publicationState: "approved",
    },
  ];
  expectFails("invalid-evidence-url", badEvidenceUrl, "invalid-url");
}
