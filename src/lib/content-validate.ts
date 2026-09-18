import { publicRoutes, type RouteId } from "@/config/routes";
import type { ContentCatalog } from "@/content/catalog";
import { contentCatalog } from "@/content/catalog";
import { SERVICE_SLUGS, type ServiceSlug } from "@/types/content";

export type ValidationIssue = {
  level: "error" | "warning";
  code: string;
  message: string;
  recordId?: string;
  field?: string;
};

export type ValidationResult = {
  ok: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
};

const ALLOWED_SLUGS = new Set<string>(SERVICE_SLUGS);

function isHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

function isMailtoUrl(value: string): boolean {
  return /^mailto:[^\s]+@.+$/i.test(value);
}

function isTelUrl(value: string): boolean {
  return /^tel:\+?[0-9]+$/.test(value);
}

function isInternalPath(value: string): boolean {
  return value.startsWith("/") && !value.startsWith("//");
}

function pushError(
  errors: ValidationIssue[],
  code: string,
  message: string,
  recordId?: string,
  field?: string,
) {
  errors.push({ level: "error", code, message, recordId, field });
}

function pushWarning(
  warnings: ValidationIssue[],
  code: string,
  message: string,
  recordId?: string,
  field?: string,
) {
  warnings.push({ level: "warning", code, message, recordId, field });
}

function assertUniqueIds(
  errors: ValidationIssue[],
  rows: { id: string }[],
  domain: string,
) {
  const seen = new Set<string>();
  for (const row of rows) {
    if (seen.has(row.id)) {
      pushError(errors, "duplicate-id", `Duplicate ${domain} id`, row.id, "id");
    }
    seen.add(row.id);
  }
}

/**
 * Validate a content catalog. Pure — no network, no credentials.
 * Does not print private field values in messages.
 */
export function validateContentCatalog(
  catalog: ContentCatalog = contentCatalog,
): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  assertUniqueIds(errors, [...catalog.services], "service");
  assertUniqueIds(errors, [...catalog.projects], "project");
  assertUniqueIds(errors, [...catalog.founders], "founder");
  assertUniqueIds(errors, [...catalog.faqs], "faq");
  assertUniqueIds(errors, [...catalog.media], "media");
  assertUniqueIds(errors, [...catalog.evidence], "evidence");
  assertUniqueIds(errors, [...catalog.businessNeeds], "business-need");

  const projectIds = new Set(catalog.projects.map((p) => p.id));
  const serviceIds = new Set(catalog.services.map((s) => s.id));
  const mediaIds = new Set(catalog.media.map((m) => m.id));
  const serviceSlugs = new Set<string>();

  if (catalog.services.length !== SERVICE_SLUGS.length) {
    pushError(
      errors,
      "service-count",
      `Expected ${SERVICE_SLUGS.length} service records`,
      undefined,
      "services",
    );
  }

  for (const service of catalog.services) {
    if (!ALLOWED_SLUGS.has(service.slug)) {
      pushError(
        errors,
        "invalid-service-slug",
        "Service slug is not in the canonical allowlist",
        service.id,
        "slug",
      );
    }
    if (serviceSlugs.has(service.slug)) {
      pushError(
        errors,
        "duplicate-slug",
        "Duplicate service slug",
        service.id,
        "slug",
      );
    }
    serviceSlugs.add(service.slug);

    const route = publicRoutes[service.routeId as RouteId];
    if (!route) {
      pushError(
        errors,
        "unknown-route",
        "Service routeId is not in the route registry",
        service.id,
        "routeId",
      );
    } else if (!route.path.endsWith(`/${service.slug}`)) {
      pushError(
        errors,
        "slug-path-mismatch",
        "Service slug does not match canonical route path",
        service.id,
        "slug",
      );
    }

    for (const relatedId of service.relatedProjectIds) {
      if (!projectIds.has(relatedId)) {
        pushError(
          errors,
          "unknown-project-ref",
          "relatedProjectIds references an unknown project",
          service.id,
          "relatedProjectIds",
        );
      }
    }

    if (service.publicationState === "approved") {
      if (!service.title.trim()) {
        pushError(
          errors,
          "approved-missing-field",
          "Approved service is missing a required field",
          service.id,
          "title",
        );
      }
      if (!service.summary.trim()) {
        pushError(
          errors,
          "approved-missing-field",
          "Approved service is missing a required field",
          service.id,
          "summary",
        );
      }
    }
  }

  for (const slug of SERVICE_SLUGS) {
    if (!serviceSlugs.has(slug)) {
      pushError(
        errors,
        "missing-service-slug",
        `Canonical service slug missing from records: ${slug}`,
        undefined,
        "slug",
      );
    }
  }

  for (const project of catalog.projects) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug)) {
      pushError(
        errors,
        "invalid-project-slug",
        "Project slug must be lowercase kebab-case",
        project.id,
        "slug",
      );
    }
    for (const mediaId of project.mediaIds) {
      if (!mediaIds.has(mediaId)) {
        pushError(
          errors,
          "unknown-media-ref",
          "mediaIds references unknown media",
          project.id,
          "mediaIds",
        );
      }
    }
    for (const link of project.publicLinks) {
      if (!isHttpsUrl(link.href) && !isInternalPath(link.href)) {
        pushError(
          errors,
          "invalid-url",
          "Project public link must be https or an internal path",
          project.id,
          "publicLinks",
        );
      }
    }
    if (project.publicationState === "approved") {
      for (const field of [
        "title",
        "zatrozContribution",
        "problem",
        "approach",
      ] as const) {
        if (!project[field].trim()) {
          pushError(
            errors,
            "approved-missing-field",
            "Approved project is missing a required field",
            project.id,
            field,
          );
        }
      }
    }
  }

  for (const founder of catalog.founders) {
    if (founder.portraitMediaId && !mediaIds.has(founder.portraitMediaId)) {
      pushError(
        errors,
        "unknown-media-ref",
        "portraitMediaId references unknown media",
        founder.id,
        "portraitMediaId",
      );
    }
    for (const link of founder.professionalUrls) {
      if (!isHttpsUrl(link.href)) {
        pushError(
          errors,
          "invalid-url",
          "Founder professional URL must use https",
          founder.id,
          "professionalUrls",
        );
      }
    }
    if (founder.publicationState === "approved") {
      for (const field of ["displayName", "role", "bio"] as const) {
        if (!founder[field].trim()) {
          pushError(
            errors,
            "approved-missing-field",
            "Approved founder is missing a required field",
            founder.id,
            field,
          );
        }
      }
    }
  }

  for (const faq of catalog.faqs) {
    if (faq.relatedServiceId && !serviceIds.has(faq.relatedServiceId)) {
      pushError(
        errors,
        "unknown-service-ref",
        "relatedServiceId references an unknown service",
        faq.id,
        "relatedServiceId",
      );
    }
    if (faq.publicationState === "approved") {
      if (!faq.question.trim() || !faq.answer.trim()) {
        pushError(
          errors,
          "approved-missing-field",
          "Approved FAQ is missing a required field",
          faq.id,
          !faq.question.trim() ? "question" : "answer",
        );
      }
    }
  }

  for (const media of catalog.media) {
    if (!media.publicPath.startsWith("/")) {
      pushError(
        errors,
        "invalid-media-path",
        "Media publicPath must start with /",
        media.id,
        "publicPath",
      );
    }
    if (media.alt.decorative === false && !media.alt.alt.trim()) {
      pushError(
        errors,
        "missing-alt",
        "Non-decorative media requires alt text",
        media.id,
        "alt",
      );
    }
    if (media.publicationState === "approved" && !media.publicPath.trim()) {
      pushError(
        errors,
        "approved-missing-field",
        "Approved media is missing a required field",
        media.id,
        "publicPath",
      );
    }
  }

  if (catalog.contact.phone.status === "confirmed") {
    const tel = `tel:${catalog.contact.phone.e164}`;
    if (!isTelUrl(tel)) {
      pushError(
        errors,
        "invalid-tel",
        "Confirmed phone e164 is not a valid tel destination",
        "contact.phone",
        "e164",
      );
    }
  }

  if (catalog.contact.email.status === "confirmed") {
    const mail = `mailto:${catalog.contact.email.display}`;
    if (!isMailtoUrl(mail)) {
      pushError(
        errors,
        "invalid-mailto",
        "Confirmed email is not a valid mailto destination",
        "contact.email",
        "display",
      );
    }
  }

  for (const [key, profile] of Object.entries(catalog.contact.social)) {
    if (profile.status === "confirmed") {
      if (!profile.href) {
        pushError(
          errors,
          "approved-missing-field",
          "Confirmed social profile is missing href",
          `contact.social.${key}`,
          "href",
        );
      } else if (!isHttpsUrl(profile.href)) {
        pushError(
          errors,
          "invalid-url",
          "Confirmed social href must use https",
          `contact.social.${key}`,
          "href",
        );
      }
    }
  }

  for (const [routeId, route] of Object.entries(publicRoutes)) {
    if (!route.implemented) {
      pushWarning(
        warnings,
        "route-unimplemented",
        `Route ${routeId} is not implemented yet — do not publish links until the page exists`,
        routeId,
        "implemented",
      );
    }
  }

  if (catalog.projects.length === 0) {
    pushWarning(
      warnings,
      "empty-projects",
      "Project collection is empty — documented content gap until verified stories exist",
    );
  }

  if (catalog.founders.length === 0) {
    pushWarning(
      warnings,
      "empty-founders",
      "Founder collection is empty — documented content gap until approved profiles exist",
    );
  }

  if (catalog.evidence.length === 0) {
    pushWarning(
      warnings,
      "empty-evidence",
      "Evidence collection is empty — homepage proof strip omitted until verified claims exist",
    );
  }

  const featuredSeen = new Set<string>();
  for (const featuredId of catalog.featuredProjectIds) {
    if (featuredSeen.has(featuredId)) {
      pushError(
        errors,
        "duplicate-featured-ref",
        "featuredProjectIds contains a duplicate project id",
        featuredId,
        "featuredProjectIds",
      );
      continue;
    }
    featuredSeen.add(featuredId);

    const project = catalog.projects.find((row) => row.id === featuredId);
    if (!project) {
      pushError(
        errors,
        "unknown-featured-ref",
        "featuredProjectIds references an unknown project",
        featuredId,
        "featuredProjectIds",
      );
      continue;
    }

    if (project.publicationState !== "approved") {
      pushError(
        errors,
        "featured-draft-project",
        "featuredProjectIds must not include draft or archived projects",
        featuredId,
        "featuredProjectIds",
      );
    }
  }

  if (
    catalog.featuredProjectIds.length === 0 &&
    catalog.projects.length === 0
  ) {
    pushWarning(
      warnings,
      "empty-featured-work",
      "No featured projects — homepage selected-work section omitted until approved stories exist",
    );
  }

  for (const item of catalog.evidence) {
    if (item.publicationState !== "approved") {
      continue;
    }

    if (!item.claim.trim()) {
      pushError(
        errors,
        "approved-missing-field",
        "Approved evidence is missing claim",
        item.id,
        "claim",
      );
    }

    if (!item.subject.label.trim()) {
      pushError(
        errors,
        "approved-missing-field",
        "Approved evidence is missing subject label",
        item.id,
        "subject.label",
      );
    }

    if (!item.supportingLabel.trim()) {
      pushError(
        errors,
        "approved-missing-field",
        "Approved evidence is missing supporting label",
        item.id,
        "supportingLabel",
      );
    }

    if (!item.sourceReference.trim()) {
      pushError(
        errors,
        "approved-missing-field",
        "Approved evidence is missing internal source reference",
        item.id,
        "sourceReference",
      );
    }

    if (item.href) {
      if (/^javascript:/i.test(item.href)) {
        pushError(
          errors,
          "invalid-url",
          "Evidence href must not use javascript:",
          item.id,
          "href",
        );
      } else if (!isHttpsUrl(item.href) && !isInternalPath(item.href)) {
        pushError(
          errors,
          "invalid-url",
          "Evidence href must be https or an internal path",
          item.id,
          "href",
        );
      }

      if (!item.linkLabel?.trim()) {
        pushError(
          errors,
          "approved-missing-field",
          "Evidence with href requires a public link label",
          item.id,
          "linkLabel",
        );
      }
    }
  }

  if (catalog.evidenceIntro.publicationState === "approved") {
    if (!catalog.evidenceIntro.heading.trim()) {
      pushError(
        errors,
        "approved-missing-field",
        "Approved evidence intro is missing heading",
        catalog.evidenceIntro.id,
        "heading",
      );
    }

    if (!catalog.evidenceIntro.text.trim()) {
      pushError(
        errors,
        "approved-missing-field",
        "Approved evidence intro is missing text",
        catalog.evidenceIntro.id,
        "text",
      );
    }
  }

  if (catalog.businessNeeds.length !== 4) {
    pushError(
      errors,
      "business-need-count",
      "Expected exactly four business-need records",
      undefined,
      "businessNeeds",
    );
  }

  const defaultNeedExists = catalog.businessNeeds.some(
    (need) => need.id === catalog.serviceExplorer.defaultNeedId,
  );
  if (!defaultNeedExists) {
    pushError(
      errors,
      "unknown-default-need",
      "serviceExplorer.defaultNeedId does not match a business need",
      catalog.serviceExplorer.id,
      "defaultNeedId",
    );
  }

  for (const need of catalog.businessNeeds) {
    if (need.serviceIds.length === 0) {
      pushError(
        errors,
        "empty-need-services",
        "Business need must reference at least one service",
        need.id,
        "serviceIds",
      );
    }

    if (!need.serviceIds.includes(need.primaryServiceId)) {
      pushError(
        errors,
        "invalid-primary-service",
        "primaryServiceId must be included in serviceIds",
        need.id,
        "primaryServiceId",
      );
    }

    for (const serviceId of need.serviceIds) {
      if (!serviceIds.has(serviceId)) {
        pushError(
          errors,
          "unknown-service-ref",
          "Business need references an unknown service",
          need.id,
          "serviceIds",
        );
      }
    }

    for (const projectId of need.relatedProjectIds) {
      if (!projectIds.has(projectId)) {
        pushError(
          errors,
          "unknown-project-ref",
          "Business need relatedProjectIds references an unknown project",
          need.id,
          "relatedProjectIds",
        );
      }
    }

    if (need.publicationState === "approved") {
      for (const field of ["title", "explanation", "deliverable"] as const) {
        if (!need[field].trim()) {
          pushError(
            errors,
            "approved-missing-field",
            "Approved business need is missing a required field",
            need.id,
            field,
          );
        }
      }

      for (const serviceId of need.serviceIds) {
        const service = catalog.services.find((row) => row.id === serviceId);
        if (service && service.publicationState !== "approved") {
          pushWarning(
            warnings,
            "need-draft-service",
            "Approved business need references a service that is not approved yet",
            need.id,
            "serviceIds",
          );
        }
      }
    }
  }

  if (catalog.serviceExplorer.publicationState === "approved") {
    for (const field of ["heading", "supporting"] as const) {
      if (!catalog.serviceExplorer[field].trim()) {
        pushError(
          errors,
          "approved-missing-field",
          "Approved service explorer is missing a required field",
          catalog.serviceExplorer.id,
          field,
        );
      }
    }
  }

  if (
    catalog.serviceExplorer.publicationState !== "approved" ||
    catalog.businessNeeds.every((need) => need.publicationState !== "approved")
  ) {
    pushWarning(
      warnings,
      "draft-service-explorer",
      "Service explorer stays off the public homepage until explorer framing and at least one need are approved",
    );
  }

  if (catalog.automationExample.publicationState === "approved") {
    for (const field of ["heading", "supporting", "workflowLabel"] as const) {
      if (!catalog.automationExample[field].trim()) {
        pushError(
          errors,
          "approved-missing-field",
          "Approved automation example is missing a required field",
          catalog.automationExample.id,
          field,
        );
      }
    }

    if (catalog.automationExample.stages.length !== 4) {
      pushError(
        errors,
        "automation-stage-count",
        "Automation example must have exactly four stages",
        catalog.automationExample.id,
        "stages",
      );
    }

    for (const stage of catalog.automationExample.stages) {
      if (!stage.label.trim() || !stage.detail.trim()) {
        pushError(
          errors,
          "approved-missing-field",
          "Approved automation stage is missing label or detail",
          catalog.automationExample.id,
          "stages",
        );
      }
    }

    if (
      !catalog.automationExample.sampleInvoice.fields.some((f) => f.needsReview)
    ) {
      pushError(
        errors,
        "missing-review-field",
        "Automation sample invoice must include at least one Needs review field",
        catalog.automationExample.id,
        "sampleInvoice",
      );
    }
  }

  if (catalog.automationExample.publicationState !== "approved") {
    pushWarning(
      warnings,
      "draft-automation-example",
      "Automation example stays off the public homepage until copy is approved",
    );
  }

  assertUniqueIds(errors, [...catalog.process.steps], "process-step");

  if (catalog.process.steps.length !== 4) {
    pushError(
      errors,
      "process-step-count",
      "Homepage process must have exactly four steps",
      catalog.process.id,
      "steps",
    );
  }

  if (catalog.process.publicationState === "approved") {
    for (const field of ["heading", "supporting"] as const) {
      if (!catalog.process[field].trim()) {
        pushError(
          errors,
          "approved-missing-field",
          "Approved process section is missing a required field",
          catalog.process.id,
          field,
        );
      }
    }

    for (const step of catalog.process.steps) {
      for (const field of ["title", "description", "customerOutput"] as const) {
        if (!step[field].trim()) {
          pushError(
            errors,
            "approved-missing-field",
            "Approved process step is missing a required field",
            step.id,
            field,
          );
        }
      }
    }
  }

  if (catalog.process.publicationState !== "approved") {
    pushWarning(
      warnings,
      "draft-home-process",
      "Delivery process stays off the public homepage until copy is approved",
    );
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
  };
}

export type { ServiceSlug };
