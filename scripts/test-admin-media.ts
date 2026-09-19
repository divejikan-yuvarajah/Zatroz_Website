/**
 * Unit tests for A04 media policy, dimensions, metadata, and Cloudinary config.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  isCloudinaryConfigured,
  resolveCloudinaryRuntimeConfig,
} from "../src/lib/media/config";
import { readImageDimensions } from "../src/lib/media/dimensions";
import { buildCloudinaryPublicId, createMediaId } from "../src/lib/media/ids";
import { parseMediaMetadata } from "../src/lib/media/metadata";
import {
  detectImageMimeFromMagic,
  escapeRegexLiteral,
  isWithinPixelBudget,
  MEDIA_MAX_BYTES,
  MEDIA_MAX_PIXELS,
  validateMediaFileBytes,
} from "../src/lib/media/policy";

let passed = 0;

function pass(name: string) {
  passed += 1;
  console.log(`ok — ${name}`);
}

function runMagicAndPolicy() {
  // Minimal PNG 1×1
  const png = Uint8Array.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xde,
  ]);
  assert.equal(detectImageMimeFromMagic(png), "image/png");
  const ok = validateMediaFileBytes(png, "image/png");
  assert.equal(ok.ok, true);

  const jpeg = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
  assert.equal(detectImageMimeFromMagic(jpeg), "image/jpeg");

  const svg = new TextEncoder().encode(
    "<svg xmlns='http://www.w3.org/2000/svg'></svg>",
  );
  assert.equal(detectImageMimeFromMagic(svg), null);
  const rejected = validateMediaFileBytes(svg, "image/svg+xml");
  assert.equal(rejected.ok, false);

  const huge = new Uint8Array(MEDIA_MAX_BYTES + 1);
  huge[0] = 0xff;
  huge[1] = 0xd8;
  huge[2] = 0xff;
  const tooBig = validateMediaFileBytes(huge);
  assert.equal(tooBig.ok, false);

  assert.equal(isWithinPixelBudget(100, 100), true);
  assert.equal(isWithinPixelBudget(MEDIA_MAX_PIXELS, 2), false);
  assert.equal(escapeRegexLiteral("a+b"), "a\\+b");
  pass("media-magic-and-policy");
}

function runDimensions() {
  // Prefer a tiny real fixture if present; otherwise synthetic PNG IHDR.
  const fixturePath = resolve(process.cwd(), "scripts/fixtures/media-1x1.png");
  try {
    const buf = new Uint8Array(readFileSync(fixturePath));
    const dims = readImageDimensions(buf, "image/png");
    assert.ok(dims);
    if (dims) {
      assert.equal(dims.width, 1);
      assert.equal(dims.height, 1);
    }
  } catch {
    const png = Uint8Array.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x03,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    ]);
    const dims = readImageDimensions(png, "image/png");
    assert.ok(dims);
    if (dims) {
      assert.equal(dims.width, 2);
      assert.equal(dims.height, 3);
    }
  }
  pass("media-dimensions");
}

function runMetadataAndIds() {
  const decorative = parseMediaMetadata({
    decorative: true,
    altText: "ignored",
    caption: "",
    provenance: "",
    licence: "",
    generationBrief: "",
  });
  assert.equal(decorative.ok, true);
  if (decorative.ok) {
    assert.equal(decorative.alt.decorative, true);
  }

  const missingAlt = parseMediaMetadata({
    decorative: false,
    altText: "  ",
    caption: "",
    provenance: "",
    licence: "",
    generationBrief: "",
  });
  assert.equal(missingAlt.ok, false);

  const described = parseMediaMetadata({
    decorative: false,
    altText: "Storefront facade",
    caption: "Exterior",
    provenance: "Owner photo",
    licence: "All rights",
    generationBrief: "",
  });
  assert.equal(described.ok, true);

  const id = createMediaId();
  assert.ok(id.startsWith("med_"));
  const publicId = buildCloudinaryPublicId({
    folderPrefix: "zatroz/development",
    mediaId: "med_abc",
    versionId: "ver_1",
  });
  assert.equal(publicId, "zatroz/development/media/med_abc/ver_1");
  pass("media-metadata-and-ids");
}

function runCloudinaryConfig() {
  assert.equal(isCloudinaryConfigured({}), false);
  const missing = resolveCloudinaryRuntimeConfig({});
  assert.equal(missing.ok, false);

  const ok = resolveCloudinaryRuntimeConfig({
    CLOUDINARY_CLOUD_NAME: "demo",
    CLOUDINARY_API_KEY: "key",
    CLOUDINARY_API_SECRET: "secret",
    APP_ENV: "development",
  });
  assert.equal(ok.ok, true);
  if (ok.ok) {
    assert.equal(ok.config.cloudName, "demo");
    assert.equal(ok.config.folderPrefix, "zatroz/development");
  }
  pass("cloudinary-config");
}

runMagicAndPolicy();
runDimensions();
runMetadataAndIds();
runCloudinaryConfig();
console.log(`\n${passed} checks passed`);
