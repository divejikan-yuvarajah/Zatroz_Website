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

  return {
    ok: errors.length === 0,
    errors,
    warnings,
  };
}

export type { ServiceSlug };
