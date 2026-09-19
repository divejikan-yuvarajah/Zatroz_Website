/**
 * Unit tests for A06 admin case-study story parsing, blocks, and gallery order.
 */

import assert from "node:assert/strict";
import {
  buildStorySnapshot,
  moveItem,
  parseStoryDraftPayload,
  validateGalleryItems,
  validateStoryBlocks,
} from "../src/lib/admin/story";
import { DRAFT_PLACEHOLDER } from "../src/lib/admin/projects";

let passed = 0;

function pass(name: string) {
  passed += 1;
  console.log(`ok — ${name}`);
}

function runMoveItem() {
  assert.deepEqual(moveItem(["a", "b", "c"], 1, "up"), ["b", "a", "c"]);
  assert.deepEqual(moveItem(["a", "b", "c"], 1, "down"), ["a", "c", "b"]);
  assert.deepEqual(moveItem(["a", "b"], 0, "up"), ["a", "b"]);
  assert.deepEqual(moveItem(["a", "b"], 1, "down"), ["a", "b"]);
  pass("gallery-and-block-reorder");
}

function runBlockValidation() {
  const ok = validateStoryBlocks(
    [
      { type: "paragraph", text: "Context paragraph." },
      { type: "list", style: "bulleted", items: ["One", "Two"] },
    ],
    "context",
  );
  assert.equal(ok.ok, true);

  const htmlish = validateStoryBlocks(
    [{ type: "html", html: "<p>x</p>" }],
    "context",
  );
  assert.equal(htmlish.ok, false);

  const emptyPara = validateStoryBlocks(
    [{ type: "paragraph", text: "   " }],
    "context",
  );
  assert.equal(emptyPara.ok, false);
  pass("story-block-validation");
}

function runGalleryValidation() {
  const ok = validateGalleryItems([
    { mediaId: "med_a", caption: "Home", conceptLabel: "Prototype screen" },
    { mediaId: "med_b", caption: "Checkout", conceptLabel: null },
  ]);
  assert.equal(ok.ok, true);
  if (ok.ok) {
    assert.equal(ok.gallery.length, 2);
  }

  const missingCaption = validateGalleryItems([
    { mediaId: "med_a", caption: "" },
  ]);
  assert.equal(missingCaption.ok, false);
  pass("gallery-validation");
}

function runStoryPayload() {
  const parsed = parseStoryDraftPayload({
    title: "Flow Pilot story",
    intro: "",
    context: [{ type: "paragraph", text: "Problem space." }],
    contribution: [],
    solution: [
      {
        type: "list",
        style: "numbered",
        items: ["Research", "Build"],
      },
    ],
    processNotes: [],
    lessons: [],
    features: ["Dashboard"],
    technologies: ["Next.js"],
    outcomes: ["Clearer enquiry path"],
    gallery: [
      { mediaId: "med_1", caption: "Overview" },
      { mediaId: "med_2", caption: "Detail" },
    ],
    testimonial: {
      quote: "Helpful delivery.",
      attribution: "Client",
      publicationState: "draft",
    },
    reviewNotes: "Needs screenshot permission",
  });
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;

  assert.equal(parsed.values.intro, DRAFT_PLACEHOLDER);
  assert.equal(parsed.values.gallery[0]?.mediaId, "med_1");
  assert.equal(parsed.values.testimonial?.quote, "Helpful delivery.");

  const snapshot = buildStorySnapshot(parsed.values);
  assert.equal(snapshot.title, "Flow Pilot story");
  assert.equal(snapshot.gallery.length, 2);
  assert.equal(snapshot.reviewNotes, "Needs screenshot permission");

  const badTestimonial = parseStoryDraftPayload({
    title: "X",
    intro: "Intro text",
    context: [],
    contribution: [],
    solution: [],
    processNotes: [],
    lessons: [],
    features: [],
    technologies: [],
    outcomes: [],
    gallery: [],
    testimonial: {
      quote: "Only quote",
      attribution: "",
      publicationState: "draft",
    },
  });
  assert.equal(badTestimonial.ok, false);
  pass("story-payload-and-snapshot");
}

runMoveItem();
runBlockValidation();
runGalleryValidation();
runStoryPayload();
console.log(`\n${passed} checks passed`);
