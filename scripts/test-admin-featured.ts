/**
 * Unit tests for A09 featured-order helpers.
 */

import assert from "node:assert/strict";
import {
  assertFeaturedIdsArePublicReady,
  orderCandidatesByFeatured,
  parseFeaturedProjectIdsForm,
  type FeaturedCandidate,
} from "../src/lib/admin/featured";

let passed = 0;

function pass(name: string) {
  passed += 1;
  console.log(`ok — ${name}`);
}

function runParse() {
  const empty = parseFeaturedProjectIdsForm(new FormData());
  assert.equal(empty.ok, true);
  if (empty.ok) assert.deepEqual(empty.featuredProjectIds, []);

  const form = new FormData();
  form.append("featuredProjectIds", "proj-a");
  form.append("featuredProjectIds", "proj-b");
  const parsed = parseFeaturedProjectIdsForm(form);
  assert.equal(parsed.ok, true);
  if (parsed.ok) {
    assert.deepEqual(parsed.featuredProjectIds, ["proj-a", "proj-b"]);
  }

  const dup = new FormData();
  dup.append("featuredProjectIds", "proj-a");
  dup.append("featuredProjectIds", "proj-a");
  const dupParsed = parseFeaturedProjectIdsForm(dup);
  assert.equal(dupParsed.ok, false);
  pass("featured-form-parse");
}

function runPublicReady() {
  const ready = new Set(["proj-a", "proj-b"]);
  const ok = assertFeaturedIdsArePublicReady({
    featuredProjectIds: ["proj-a"],
    publicReadyIds: ready,
  });
  assert.equal(ok.ok, true);

  const bad = assertFeaturedIdsArePublicReady({
    featuredProjectIds: ["proj-draft"],
    publicReadyIds: ready,
  });
  assert.equal(bad.ok, false);
  pass("featured-public-ready");
}

function runOrder() {
  const candidates: FeaturedCandidate[] = [
    {
      editorialId: "proj-a",
      title: "A",
      slug: "a",
      summaryPublished: true,
    },
    {
      editorialId: "proj-b",
      title: "B",
      slug: "b",
      summaryPublished: true,
    },
    {
      editorialId: "proj-c",
      title: "C",
      slug: "c",
      summaryPublished: true,
    },
  ];
  const ordered = orderCandidatesByFeatured(candidates, ["proj-c", "proj-a"]);
  assert.deepEqual(
    ordered.featured.map((c) => c.editorialId),
    ["proj-c", "proj-a"],
  );
  assert.deepEqual(
    ordered.available.map((c) => c.editorialId),
    ["proj-b"],
  );
  pass("featured-order-helpers");
}

runParse();
runPublicReady();
runOrder();
console.log(`\n${passed} checks passed`);
