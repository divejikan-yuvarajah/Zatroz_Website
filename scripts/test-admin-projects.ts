/**
 * Unit tests for A05 admin project draft parsing, snapshots, and list query helpers.
 */

import assert from "node:assert/strict";
import {
  ADMIN_PROJECT_PAGE_SIZE,
  buildStoryStub,
  buildSummarySnapshot,
  classifyListPublication,
  DRAFT_PLACEHOLDER,
  editorialIdFromSlug,
  parseGalleryField,
  parseProjectDraftFormData,
  parseProjectListQuery,
  parsePublicLinks,
  slugifyTitle,
} from "../src/lib/admin/projects";
import {
  canSeeAdminNavItem,
  visibleAdminNav,
  visibleAdminShortcuts,
} from "../src/lib/admin/nav";
import { buildAuthContext } from "../src/lib/security/auth-gate";

let passed = 0;

function pass(name: string) {
  passed += 1;
  console.log(`ok — ${name}`);
}

function runSlugAndIds() {
  assert.equal(slugifyTitle("Flow Pilot AI"), "flow-pilot-ai");
  assert.equal(editorialIdFromSlug("flow-pilot-ai"), "proj-flow-pilot-ai");
  assert.equal(
    classifyListPublication({ publishedSummaryRevisionId: null }),
    "draft",
  );
  assert.equal(
    classifyListPublication({ publishedSummaryRevisionId: "rev-1" }),
    "published",
  );
  pass("slug-and-ids");
}

function runListQuery() {
  const q = parseProjectListQuery({
    q: "  pilot ",
    workStatus: "prototype",
    publication: "draft",
    page: "2",
  });
  assert.equal(q.search, "pilot");
  assert.equal(q.workStatus, "prototype");
  assert.equal(q.publication, "draft");
  assert.equal(q.page, 2);
  assert.equal(ADMIN_PROJECT_PAGE_SIZE, 10);

  const bad = parseProjectListQuery({
    workStatus: "not-a-status",
    publication: "maybe",
    page: "0",
  });
  assert.equal(bad.workStatus, "all");
  assert.equal(bad.publication, "all");
  assert.equal(bad.page, 1);
  pass("list-query");
}

function runLinkAndGalleryParsers() {
  const links = parsePublicLinks(
    "Site | https://example.com\nDocs | http://docs.example",
  );
  assert.equal(links.ok, true);
  if (links.ok) {
    assert.equal(links.links.length, 2);
    assert.equal(links.links[0]?.label, "Site");
  }

  const badLink = parsePublicLinks("Missing separator");
  assert.equal(badLink.ok, false);

  const gallery = parseGalleryField(
    "med_abc | Home screen\nmed_def | Checkout",
  );
  assert.equal(gallery.ok, true);
  if (gallery.ok) {
    assert.equal(gallery.gallery.length, 2);
  }

  const badGallery = parseGalleryField("only-id");
  assert.equal(badGallery.ok, false);
  pass("link-and-gallery-parsers");
}

function runDraftFormParse() {
  const fd = new FormData();
  fd.set("title", "Flow Pilot");
  fd.set("slug", "flow-pilot");
  fd.set("summary", "A short summary for the card.");
  fd.set("workStatus", "client-work");
  fd.append("serviceIds", "svc-websites-ecommerce");
  fd.set("technologies", "Next.js, MongoDB");
  fd.set("contributors", "Ada\nGrace");
  fd.set("publicLinks", "Live | https://example.com");
  fd.set("coverMediaId", "med_cover");
  fd.set("gallery", "med_g1 | Evidence shot");
  fd.set("featuredEligible", "on");
  fd.set("editorialOrder", "3");

  const parsed = parseProjectDraftFormData(fd, {
    allowedServiceIds: ["svc-websites-ecommerce", "svc-ui-ux-design"],
  });
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;

  assert.equal(parsed.values.title, "Flow Pilot");
  assert.equal(parsed.values.technologies.length, 2);
  assert.equal(parsed.values.featuredEligible, true);
  assert.equal(parsed.values.editorialOrder, 3);
  assert.equal(parsed.values.zatrozContribution, DRAFT_PLACEHOLDER);

  const summary = buildSummarySnapshot(parsed.values);
  assert.equal(summary.mediaIds[0], "med_cover");
  assert.equal(summary.editorialOrder, 3);
  assert.ok(summary.mediaIds.includes("med_g1"));

  const story = buildStoryStub(parsed.values, null);
  assert.equal(story.intro, DRAFT_PLACEHOLDER);
  assert.equal(story.gallery.length, 1);
  assert.deepEqual(story.technologies, ["Next.js", "MongoDB"]);

  const preserved = buildStoryStub(parsed.values, {
    ...story,
    intro: "Kept intro",
    context: [{ type: "paragraph", text: "Context stays" }],
  });
  assert.equal(preserved.intro, "Kept intro");
  assert.equal(preserved.context.length, 1);

  const badSlug = new FormData();
  badSlug.set("title", "X");
  badSlug.set("slug", "Bad Slug");
  badSlug.set("summary", "Summary text");
  badSlug.set("workStatus", "prototype");
  const rejected = parseProjectDraftFormData(badSlug);
  assert.equal(rejected.ok, false);
  pass("draft-form-parse-and-snapshots");
}

function runNavAvailable() {
  const owner = buildAuthContext({
    authAvailable: true,
    authenticated: true,
    mfaCompleted: true,
    staffRole: "owner",
    userId: "o1",
    email: "owner@example.com",
  });
  const nav = visibleAdminNav(owner);
  const projects = nav.find((item) => item.id === "projects");
  assert.ok(projects);
  assert.equal(projects?.comingLater, undefined);
  assert.equal(canSeeAdminNavItem(projects!, owner), true);

  const shortcuts = visibleAdminShortcuts(owner);
  const create = shortcuts.find((s) => s.id === "new-project");
  const edit = shortcuts.find((s) => s.id === "edit-projects");
  assert.equal(create?.available, true);
  assert.equal(edit?.available, true);
  pass("nav-projects-available");
}

runSlugAndIds();
runListQuery();
runLinkAndGalleryParsers();
runDraftFormParse();
runNavAvailable();
console.log(`\n${passed} checks passed`);
