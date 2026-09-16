/**
 * Lightweight SITE_URL helper check (no secrets, no test framework).
 * Run: node --experimental-strip-types scripts/verify-site-url.ts
 */
import { resolveSiteUrl } from "../src/server/resolve-site-url.ts";

function expectEqual(actual: string, expected: string, label: string) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected} but got ${actual}`);
  }
  console.log(`PASS ${label} -> ${actual}`);
}

function expectThrow(fn: () => void, label: string) {
  try {
    fn();
    throw new Error(`${label}: expected an error`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes("SITE_URL")) {
      throw new Error(
        `${label}: error should mention SITE_URL, got: ${message}`,
      );
    }
    console.log(`PASS ${label} -> threw mentioning SITE_URL`);
  }
}

expectEqual(
  resolveSiteUrl(undefined),
  "http://localhost:3000",
  "undefined -> localhost fallback",
);
expectEqual(
  resolveSiteUrl(""),
  "http://localhost:3000",
  "empty -> localhost fallback",
);
expectEqual(
  resolveSiteUrl("http://localhost:3000"),
  "http://localhost:3000",
  "localhost explicit",
);
expectEqual(
  resolveSiteUrl("https://www.example.com/"),
  "https://www.example.com",
  "example https origin",
);
expectThrow(() => resolveSiteUrl("not-a-url"), "invalid URL");
expectThrow(() => resolveSiteUrl("ftp://example.com"), "non-http protocol");

console.log("All SITE_URL helper checks passed.");
