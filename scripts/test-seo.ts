/**
 * Step 59 focused SEO helpers — origin, indexing policy, JSON-LD escaping.
 * Does not call live search engines or mutate production content.
 */

import assert from "node:assert/strict";
import {
  environmentRobotsDirective,
  isPublicIndexingEnabled,
} from "../src/lib/seo/indexing-policy";
import {
  buildBreadcrumbListJsonLd,
  buildOrganizationJsonLd,
  serializeJsonLd,
} from "../src/lib/seo/json-ld";
import {
  joinAbsoluteUrl,
  resolveCanonicalOrigin,
} from "../src/lib/seo/site-origin";

function pass(label: string) {
  console.log(`PASS ${label}`);
}

function testOrigin() {
  assert.equal(
    resolveCanonicalOrigin("https://zatroz.example/"),
    "https://zatroz.example",
  );
  assert.equal(
    resolveCanonicalOrigin("http://localhost:3000"),
    "http://localhost:3000",
  );
  assert.equal(
    joinAbsoluteUrl("https://zatroz.example", "/work"),
    "https://zatroz.example/work",
  );
  assert.throws(() => joinAbsoluteUrl("https://zatroz.example", "work"));
  pass("canonical origin + absolute URL join");
}

function testIndexingPolicy() {
  assert.equal(isPublicIndexingEnabled({ APP_ENV: "development" }), false);
  assert.equal(isPublicIndexingEnabled({ APP_ENV: "preview" }), false);
  assert.equal(
    isPublicIndexingEnabled({
      APP_ENV: "production",
      VERCEL_ENV: "preview",
    }),
    false,
  );
  assert.equal(
    isPublicIndexingEnabled({
      APP_ENV: "production",
      VERCEL_ENV: "production",
    }),
    true,
  );
  assert.equal(isPublicIndexingEnabled({ APP_ENV: "production" }), true);
  assert.deepEqual(environmentRobotsDirective({ APP_ENV: "preview" }), {
    index: false,
    follow: false,
  });
  assert.deepEqual(
    environmentRobotsDirective({
      APP_ENV: "production",
      VERCEL_ENV: "production",
    }),
    { index: true, follow: true },
  );
  pass("indexing policy production vs preview");
}

function testJsonLdEscaping() {
  const payload = buildOrganizationJsonLd({
    name: "Zatroz <script>",
    url: "https://zatroz.example",
  });
  const serialized = serializeJsonLd(payload);
  assert.equal(serialized.includes("<"), false);
  assert.equal(serialized.includes("\\u003c"), true);

  const crumbs = buildBreadcrumbListJsonLd([
    { name: "Home", item: "https://zatroz.example/" },
    { name: "Work" },
  ]);
  assert.equal(crumbs["@type"], "BreadcrumbList");
  pass("JSON-LD escaping + breadcrumb shape");
}

function main() {
  testOrigin();
  testIndexingPolicy();
  testJsonLdEscaping();
  console.log("All Step 59 SEO helper checks passed.");
}

main();
