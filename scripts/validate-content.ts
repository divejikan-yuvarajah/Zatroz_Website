/**
 * Content catalog validation.
 * Run: npm run validate:content
 * Uses Node type-stripping (no separate compile step).
 */
import { validateContentCatalog } from "../src/lib/content-validate";
import { runFixtureValidations } from "./validate-content-fixtures";

const result = validateContentCatalog();

for (const warning of result.warnings) {
  const where = warning.recordId
    ? ` [${warning.recordId}${warning.field ? `.${warning.field}` : ""}]`
    : "";
  console.log(`WARN ${warning.code}${where}: ${warning.message}`);
}

for (const error of result.errors) {
  const where = error.recordId
    ? ` [${error.recordId}${error.field ? `.${error.field}` : ""}]`
    : "";
  console.error(`ERROR ${error.code}${where}: ${error.message}`);
}

if (!result.ok) {
  console.error(
    `Content validation failed with ${result.errors.length} error(s).`,
  );
  process.exit(1);
}

console.log(
  `Content catalog OK (${result.warnings.length} readiness warning(s)).`,
);

runFixtureValidations();
console.log("Content validation fixtures passed.");
