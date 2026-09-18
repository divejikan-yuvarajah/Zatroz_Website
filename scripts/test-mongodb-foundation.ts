/**
 * Unit tests for MongoDB config validation and connection singleton behaviour.
 * Does not require a live Atlas cluster.
 */
import assert from "node:assert/strict";
import {
  isAllowedMongoDbName,
  isMongoUriScheme,
  mongoConfigLabel,
  resolveMongoRuntimeConfig,
  sanitizeMongoError,
} from "../src/lib/mongodb/config";
import {
  getMongoClient,
  resetMongoClientStateForTests,
} from "../src/lib/mongodb/connection";

function pass(label: string) {
  console.log(`PASS ${label}`);
}

function runConfigTests() {
  const missing = resolveMongoRuntimeConfig({});
  assert.equal(missing.ok, false);
  pass("missing-config-fails");

  const badScheme = resolveMongoRuntimeConfig({
    MONGODB_URI: "postgres://example",
    MONGODB_DB_NAME: "zatroz_dev",
    APP_ENV: "development",
  });
  assert.equal(badScheme.ok, false);
  pass("rejects-non-mongo-scheme");

  const badName = resolveMongoRuntimeConfig({
    MONGODB_URI: "mongodb+srv://user:pass@cluster.example.net",
    MONGODB_DB_NAME: "test",
    APP_ENV: "development",
  });
  assert.equal(badName.ok, false);
  pass("rejects-bare-test-db-name");

  assert.equal(isAllowedMongoDbName("zatroz_dev"), true);
  assert.equal(isAllowedMongoDbName("test"), false);
  assert.equal(isMongoUriScheme("mongodb://localhost:27017"), true);
  assert.equal(isMongoUriScheme("mongodb+srv://x.y.z"), true);
  pass("name-and-scheme-helpers");

  const ok = resolveMongoRuntimeConfig({
    MONGODB_URI:
      "mongodb+srv://user:pass@cluster.example.net/?retryWrites=true",
    MONGODB_DB_NAME: "zatroz_dev",
    APP_ENV: "development",
  });
  assert.equal(ok.ok, true);
  if (ok.ok) {
    assert.equal(ok.config.dbName, "zatroz_dev");
    assert.equal(ok.config.appEnv, "development");
    assert.match(mongoConfigLabel(ok.config), /zatroz_dev/);
    assert.doesNotMatch(mongoConfigLabel(ok.config), /pass/);
  }
  pass("valid-config");

  const sanitized = sanitizeMongoError({ name: "MongoServerSelectionError" });
  assert.match(sanitized, /network|DNS|IP/i);
  assert.doesNotMatch(sanitized, /pass/);
  pass("sanitize-error");
}

async function runConnectionGuardTests() {
  resetMongoClientStateForTests();
  delete process.env.MONGODB_URI;
  delete process.env.MONGODB_DB_NAME;

  await assert.rejects(
    () => getMongoClient(),
    /not configured/i,
    "getMongoClient rejects without config",
  );
  pass("lazy-reject-without-config");

  // Concurrent rejects should not leave a poisoned success promise.
  resetMongoClientStateForTests();
  const [a, b] = await Promise.allSettled([getMongoClient(), getMongoClient()]);
  assert.equal(a.status, "rejected");
  assert.equal(b.status, "rejected");
  pass("concurrent-reject-without-config");

  // After failure, a later call still rejects cleanly (promise was reset).
  await assert.rejects(() => getMongoClient(), /not configured/i);
  pass("retry-after-reject-without-poison");
}

async function main() {
  runConfigTests();
  await runConnectionGuardTests();
  console.log("MongoDB foundation unit tests passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
