/**
 * Lightweight navigation matcher check (no test framework).
 * Run: node --experimental-strip-types scripts/verify-navigation.ts
 */
import { getNavLinkState, normalizePathname } from "../src/lib/navigation.ts";

function expectEqual(
  actual: string | boolean,
  expected: string | boolean,
  label: string,
) {
  if (actual !== expected) {
    throw new Error(
      `${label}: expected ${String(expected)} but got ${String(actual)}`,
    );
  }
  console.log(`PASS ${label}`);
}

expectEqual(normalizePathname("/"), "/", "root");
expectEqual(normalizePathname("/services/"), "/services", "trailing slash");
expectEqual(normalizePathname("/services?x=1"), "/services", "query ignored");
expectEqual(normalizePathname("/services#panel"), "/services", "hash ignored");

const home = getNavLinkState("/", "/");
expectEqual(home.isCurrent, true, "home current");
expectEqual(home.isSection, true, "home section is only exact");

const homeChild = getNavLinkState("/about", "/");
expectEqual(homeChild.isCurrent, false, "home not current on /about");
expectEqual(homeChild.isSection, false, "home not section on /about");

const services = getNavLinkState("/services", "/services");
expectEqual(services.isCurrent, true, "services exact current");
expectEqual(services.isSection, true, "services exact is section");

const serviceChild = getNavLinkState(
  "/services/websites-ecommerce",
  "/services",
);
expectEqual(
  serviceChild.isCurrent,
  false,
  "child is not current services page",
);
expectEqual(serviceChild.isSection, true, "child is services section");

const serviceUnrelated = getNavLinkState("/services-old", "/services");
expectEqual(serviceUnrelated.isCurrent, false, "services-old not current");
expectEqual(serviceUnrelated.isSection, false, "services-old not section");

const workChild = getNavLinkState("/work/example-slug", "/work");
expectEqual(workChild.isCurrent, false, "work child not current");
expectEqual(workChild.isSection, true, "work child is section");

const hash = getNavLinkState("/", "#colour-heading");
expectEqual(hash.isCurrent, false, "hash href is not a page current");
expectEqual(hash.isSection, false, "hash href is not a section");

console.log("All navigation matcher checks passed.");
