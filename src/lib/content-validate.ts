import { publicRoutes, type RouteId } from "@/config/routes";
import type { ContentCatalog } from "@/content/catalog";
import { contentCatalog } from "@/content/catalog";
import {
  PROJECT_STORY_LIMITS,
  type ProjectStoryRecord,
  type StoryContentBlock,
} from "@/content/projects";
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

function validateStoryBlocks(
  errors: ValidationIssue[],
  projectId: string,
  field: string,
  blocks: readonly StoryContentBlock[],
): void {
  if (blocks.length > PROJECT_STORY_LIMITS.maxBlocksPerSection) {
    pushError(
      errors,
      "story-block-limit",
      `Story section exceeds ${PROJECT_STORY_LIMITS.maxBlocksPerSection} blocks`,
      projectId,
      field,
    );
  }
  for (const block of blocks) {
    if (block.type === "paragraph") {
      if (block.text.length > PROJECT_STORY_LIMITS.blockTextMax) {
        pushError(
          errors,
          "story-text-length",
          "Story paragraph exceeds maximum length",
          projectId,
          field,
        );
      }
      continue;
    }
    if (block.type === "list") {
      if (block.items.length > PROJECT_STORY_LIMITS.maxListItems) {
        pushError(
          errors,
          "story-list-limit",
          "Story list exceeds maximum items",
          projectId,
          field,
        );
      }
      for (const item of block.items) {
        if (item.length > PROJECT_STORY_LIMITS.listItemMax) {
          pushError(
            errors,
            "story-text-length",
            "Story list item exceeds maximum length",
            projectId,
            field,
          );
        }
      }
      continue;
    }
    pushError(
      errors,
      "unsupported-story-block",
      "Story contains an unsupported block type",
      projectId,
      field,
    );
  }
}

function validateProjectStory(
  errors: ValidationIssue[],
  projectId: string,
  story: ProjectStoryRecord,
  mediaIds: Set<string>,
): void {
  if (story.title.length > PROJECT_STORY_LIMITS.titleMax) {
    pushError(
      errors,
      "story-text-length",
      "Story title exceeds maximum length",
      projectId,
      "story.title",
    );
  }
  if (story.intro.length > PROJECT_STORY_LIMITS.introMax) {
    pushError(
      errors,
      "story-text-length",
      "Story intro exceeds maximum length",
      projectId,
      "story.intro",
    );
  }
  validateStoryBlocks(errors, projectId, "story.context", story.context);
  validateStoryBlocks(
    errors,
    projectId,
    "story.contribution",
    story.contribution,
  );
  validateStoryBlocks(errors, projectId, "story.solution", story.solution);
  validateStoryBlocks(
    errors,
    projectId,
    "story.processNotes",
    story.processNotes,
  );
  validateStoryBlocks(errors, projectId, "story.lessons", story.lessons);

  if (story.features.length > PROJECT_STORY_LIMITS.maxFeatures) {
    pushError(
      errors,
      "story-feature-limit",
      "Story features exceed maximum count",
      projectId,
      "story.features",
    );
  }
  if (story.technologies.length > PROJECT_STORY_LIMITS.maxTechnologies) {
    pushError(
      errors,
      "story-tech-limit",
      "Story technologies exceed maximum count",
      projectId,
      "story.technologies",
    );
  }
  if (story.outcomes.length > PROJECT_STORY_LIMITS.maxOutcomes) {
    pushError(
      errors,
      "story-outcome-limit",
      "Story outcomes exceed maximum count",
      projectId,
      "story.outcomes",
    );
  }
  if (story.gallery.length > PROJECT_STORY_LIMITS.maxGalleryItems) {
    pushError(
      errors,
      "story-gallery-limit",
      "Story gallery exceeds maximum items",
      projectId,
      "story.gallery",
    );
  }
  for (const item of story.gallery) {
    if (!mediaIds.has(item.mediaId)) {
      pushError(
        errors,
        "unknown-media-ref",
        "story.gallery references unknown media",
        projectId,
        "story.gallery",
      );
    }
    if (item.caption.length > PROJECT_STORY_LIMITS.captionMax) {
      pushError(
        errors,
        "story-text-length",
        "Gallery caption exceeds maximum length",
        projectId,
        "story.gallery",
      );
    }
  }
  if (story.testimonial) {
    if (
      story.testimonial.quote.length > PROJECT_STORY_LIMITS.testimonialQuoteMax
    ) {
      pushError(
        errors,
        "story-text-length",
        "Testimonial quote exceeds maximum length",
        projectId,
        "story.testimonial",
      );
    }
    if (
      story.testimonial.attribution.length >
      PROJECT_STORY_LIMITS.testimonialAttributionMax
    ) {
      pushError(
        errors,
        "story-text-length",
        "Testimonial attribution exceeds maximum length",
        projectId,
        "story.testimonial",
      );
    }
  }
  if (story.publicationState === "approved") {
    if (!story.title.trim() || !story.intro.trim()) {
      pushError(
        errors,
        "approved-missing-field",
        "Approved story requires title and intro",
        projectId,
        "story",
      );
    }
    if (
      story.context.length === 0 ||
      story.contribution.length === 0 ||
      story.solution.length === 0
    ) {
      pushError(
        errors,
        "approved-missing-field",
        "Approved story requires context, contribution, and solution sections",
        projectId,
        "story",
      );
    }
  }
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

function assertUniqueStringIds(
  errors: ValidationIssue[],
  ids: readonly string[],
  domain: string,
  recordId: string,
  field: string,
) {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) {
      pushError(
        errors,
        "duplicate-id",
        `Duplicate ${domain} id in ${field}`,
        recordId,
        field,
      );
    }
    seen.add(id);
  }
}

function validateServiceDetail(
  errors: ValidationIssue[],
  warnings: ValidationIssue[],
  catalog: ContentCatalog,
  service: ContentCatalog["services"][number],
  projectIds: Set<string>,
  serviceIds: Set<string>,
) {
  const detail = service.detail;
  if (!detail) {
    return;
  }

  assertUniqueStringIds(
    errors,
    detail.audienceItems.map((item) => item.id),
    "detail-audience",
    service.id,
    "detail.audienceItems",
  );
  assertUniqueStringIds(
    errors,
    detail.problemItems.map((item) => item.id),
    "detail-problem",
    service.id,
    "detail.problemItems",
  );
  assertUniqueStringIds(
    errors,
    detail.scopeOptions.map((item) => item.id),
    "detail-scope",
    service.id,
    "detail.scopeOptions",
  );
  assertUniqueStringIds(
    errors,
    detail.deliverableGroups.map((item) => item.id),
    "detail-deliverable",
    service.id,
    "detail.deliverableGroups",
  );
  assertUniqueStringIds(
    errors,
    detail.deliveryStages.map((item) => item.id),
    "detail-stage",
    service.id,
    "detail.deliveryStages",
  );
  assertUniqueStringIds(
    errors,
    detail.faqIds,
    "detail-faq-ref",
    service.id,
    "detail.faqIds",
  );
  assertUniqueStringIds(
    errors,
    detail.relatedProjectIds,
    "detail-project-ref",
    service.id,
    "detail.relatedProjectIds",
  );
  assertUniqueStringIds(
    errors,
    detail.relatedServiceIds,
    "detail-service-ref",
    service.id,
    "detail.relatedServiceIds",
  );

  for (const projectId of detail.relatedProjectIds) {
    if (!projectIds.has(projectId)) {
      pushError(
        errors,
        "unknown-project-ref",
        "detail.relatedProjectIds references an unknown project",
        service.id,
        "detail.relatedProjectIds",
      );
    }
  }

  for (const relatedServiceId of detail.relatedServiceIds) {
    if (!serviceIds.has(relatedServiceId)) {
      pushError(
        errors,
        "unknown-service-ref",
        "detail.relatedServiceIds references an unknown service",
        service.id,
        "detail.relatedServiceIds",
      );
    }
    if (relatedServiceId === service.id) {
      pushError(
        errors,
        "self-related-service",
        "detail.relatedServiceIds must not include the same service",
        service.id,
        "detail.relatedServiceIds",
      );
    }
  }

  const faqIds = new Set(catalog.faqs.map((faq) => faq.id));
  for (const faqId of detail.faqIds) {
    if (!faqIds.has(faqId)) {
      pushError(
        errors,
        "unknown-faq-ref",
        "detail.faqIds references an unknown FAQ",
        service.id,
        "detail.faqIds",
      );
    }
  }

  if (detail.publicationState === "approved") {
    for (const field of [
      "heroTitle",
      "introduction",
      "primaryCtaLabel",
      "pageTitle",
      "pageDescription",
    ] as const) {
      if (!detail[field].trim()) {
        pushError(
          errors,
          "approved-detail-missing-field",
          "Approved service detail is missing a required field",
          service.id,
          `detail.${field}`,
        );
      }
    }

    if (detail.audienceItems.length === 0) {
      pushError(
        errors,
        "approved-detail-missing-field",
        "Approved service detail needs at least one audience item",
        service.id,
        "detail.audienceItems",
      );
    }

    if (detail.deliverableGroups.length === 0) {
      pushError(
        errors,
        "approved-detail-missing-field",
        "Approved service detail needs at least one deliverable group",
        service.id,
        "detail.deliverableGroups",
      );
    }

    if (detail.clientInputs.length === 0) {
      pushError(
        errors,
        "approved-detail-missing-field",
        "Approved service detail needs at least one client input",
        service.id,
        "detail.clientInputs",
      );
    }

    if (detail.boundaries.length === 0) {
      pushError(
        errors,
        "approved-detail-missing-field",
        "Approved service detail needs at least one boundary",
        service.id,
        "detail.boundaries",
      );
    }

    if (service.publicationState !== "approved") {
      pushWarning(
        warnings,
        "detail-before-summary",
        "Service detail is approved while the overview summary is still draft",
        service.id,
        "detail.publicationState",
      );
    }

    const route = publicRoutes[service.routeId as RouteId];
    if (route && !route.implemented) {
      pushWarning(
        warnings,
        "detail-route-unimplemented",
        "Approved detail copy exists but the service detail route is not implemented yet",
        service.id,
        "routeId",
      );
    }
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
  assertUniqueIds(errors, [...catalog.feedback], "feedback");
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
      if (!service.whoItSuits.trim()) {
        pushError(
          errors,
          "approved-missing-field",
          "Approved service is missing a required field",
          service.id,
          "whoItSuits",
        );
      }
      if (service.deliverables.length === 0) {
        pushError(
          errors,
          "approved-missing-field",
          "Approved service needs at least one deliverable for the overview",
          service.id,
          "deliverables",
        );
      }
    }

    validateServiceDetail(
      errors,
      warnings,
      catalog,
      service,
      projectIds,
      serviceIds,
    );
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
    for (const serviceId of project.serviceIds) {
      if (!serviceIds.has(serviceId)) {
        pushError(
          errors,
          "unknown-service-ref",
          "project.serviceIds references an unknown service",
          project.id,
          "serviceIds",
        );
      }
    }
    if (
      project.storyPublicationState != null &&
      project.storyPublicationState !== "draft" &&
      project.storyPublicationState !== "approved" &&
      project.storyPublicationState !== "archived"
    ) {
      pushError(
        errors,
        "invalid-story-state",
        "storyPublicationState must be draft, approved, archived, or null",
        project.id,
        "storyPublicationState",
      );
    }
    if (project.story == null && project.storyPublicationState != null) {
      pushError(
        errors,
        "story-state-mismatch",
        "storyPublicationState is set but story body is missing",
        project.id,
        "story",
      );
    }
    if (project.story != null) {
      if (
        project.storyPublicationState == null ||
        project.storyPublicationState !== project.story.publicationState
      ) {
        pushError(
          errors,
          "story-state-mismatch",
          "storyPublicationState must match story.publicationState",
          project.id,
          "storyPublicationState",
        );
      }
      validateProjectStory(errors, project.id, project.story, mediaIds);
    }
    if (project.publicationState === "approved") {
      for (const field of [
        "title",
        "summary",
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

  for (const item of catalog.feedback) {
    if (item.publicationState !== "approved") {
      continue;
    }

    if (!item.quote.trim()) {
      pushError(
        errors,
        "approved-missing-field",
        "Approved feedback is missing a quote",
        item.id,
        "quote",
      );
    }

    if (item.kind === "testimonial") {
      if (!item.attribution?.trim()) {
        pushError(
          errors,
          "approved-missing-field",
          "Approved testimonial requires attribution",
          item.id,
          "attribution",
        );
      }
    }

    if (item.kind === "project-lesson") {
      if (item.attribution?.trim()) {
        pushError(
          errors,
          "lesson-looks-like-testimonial",
          "Project lessons must not carry customer attribution",
          item.id,
          "attribution",
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

  if (catalog.people.publicationState === "approved") {
    for (const field of [
      "heading",
      "companyIntro",
      "communicationNote",
    ] as const) {
      if (!catalog.people[field].trim()) {
        pushError(
          errors,
          "approved-missing-field",
          "Approved people section is missing a required field",
          catalog.people.id,
          field,
        );
      }
    }

    if (catalog.people.teamPhotoMediaId) {
      if (!mediaIds.has(catalog.people.teamPhotoMediaId)) {
        pushError(
          errors,
          "unknown-media-ref",
          "people.teamPhotoMediaId references unknown media",
          catalog.people.id,
          "teamPhotoMediaId",
        );
      }
    }

    for (const principle of catalog.people.workingPrinciples) {
      if (!principle.title.trim() || !principle.description.trim()) {
        pushError(
          errors,
          "approved-missing-field",
          "Approved working principle is missing title or description",
          principle.id,
          "workingPrinciples",
        );
      }
    }
  }

  if (catalog.people.publicationState !== "approved") {
    pushWarning(
      warnings,
      "draft-home-people",
      "People section stays off the public homepage until company introduction is approved",
    );
  }

  if (catalog.questions.publicationState === "approved") {
    for (const field of ["heading", "supporting"] as const) {
      if (!catalog.questions[field].trim()) {
        pushError(
          errors,
          "approved-missing-field",
          "Approved questions section is missing a required field",
          catalog.questions.id,
          field,
        );
      }
    }

    const approvedFaqs = catalog.faqs.filter(
      (faq) => faq.publicationState === "approved",
    );
    const approvedFeedback = catalog.feedback.filter(
      (item) => item.publicationState === "approved",
    );

    if (approvedFaqs.length === 0 && approvedFeedback.length === 0) {
      pushError(
        errors,
        "approved-questions-empty",
        "Approved questions section needs at least one approved FAQ or feedback item",
        catalog.questions.id,
      );
    }
  }

  if (catalog.questions.publicationState !== "approved") {
    pushWarning(
      warnings,
      "draft-home-questions",
      "Feedback and FAQs stay off the public homepage until framing and content are approved",
    );
  }

  if (catalog.finalCta.publicationState === "approved") {
    for (const field of ["heading", "supporting"] as const) {
      if (!catalog.finalCta[field].trim()) {
        pushError(
          errors,
          "approved-missing-field",
          "Approved final invitation is missing a required field",
          catalog.finalCta.id,
          field,
        );
      }
    }
  }

  if (catalog.finalCta.publicationState !== "approved") {
    pushWarning(
      warnings,
      "draft-home-final-cta",
      "Final enquiry invitation stays off the public homepage until copy is approved",
    );
  }

  if (catalog.servicesOverview.publicationState === "approved") {
    for (const field of ["heading", "supporting"] as const) {
      if (!catalog.servicesOverview[field].trim()) {
        pushError(
          errors,
          "approved-missing-field",
          "Approved services overview is missing a required field",
          catalog.servicesOverview.id,
          field,
        );
      }
    }
  }

  if (catalog.servicesOverview.publicationState !== "approved") {
    pushWarning(
      warnings,
      "draft-services-overview",
      "Services overview framing stays draft — public /services omits proposed marketing copy until approved",
    );
  }

  const contactReady =
    publicRoutes.contact.implemented ||
    catalog.contact.email.status === "confirmed" ||
    catalog.contact.whatsapp.status === "confirmed";

  if (!contactReady) {
    pushWarning(
      warnings,
      "no-usable-enquiry-action",
      "No usable enquiry action yet — confirm email/WhatsApp or implement /contact before the final invitation can publish",
    );
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
  };
}

export type { ServiceSlug };
