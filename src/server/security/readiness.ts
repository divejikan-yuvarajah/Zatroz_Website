/**
 * Bounded server-side readiness for enquiry submission prerequisites.
 * Details stay internal — do not expose on a public route.
 */

import "server-only";

import type { Db } from "mongodb";
import { COLLECTION_NAMES } from "@/lib/mongodb/collections";
import { MIGRATION_ID } from "@/lib/mongodb/schema/definitions";
import { evaluateEnquiryEnvReadiness } from "@/lib/security/readiness-env";
import { resolveAbuseHashSecrets } from "@/server/security/secrets";

export type ReadinessCheckId =
  | "env-mongodb"
  | "env-abuse-secret"
  | "env-origin"
  | "migration-ledger"
  | "index-enquiries-idempotency"
  | "index-rate-limit-ttl"
  | "enquiries-enabled-flag"
  | "env-turnstile-site-key"
  | "env-turnstile-secret";

export type ReadinessItem = Readonly<{
  id: ReadinessCheckId;
  ok: boolean;
  detail: string;
}>;

export type ReadinessReport = Readonly<{
  ready: boolean;
  checkedAt: string;
  items: readonly ReadinessItem[];
}>;

const CRITICAL_INDEXES: ReadonlyArray<{
  collection: string;
  indexName: string;
  checkId: ReadinessCheckId;
}> = [
  {
    collection: COLLECTION_NAMES.enquiries,
    indexName: "uniq_enquiries_idempotency_digest",
    checkId: "index-enquiries-idempotency",
  },
  {
    collection: COLLECTION_NAMES.rateLimitBuckets,
    indexName: "ttl_rate_limit_buckets_expiresAt",
    checkId: "index-rate-limit-ttl",
  },
];

export async function evaluateEnquiryReadiness(options: {
  db?: Db;
  env?: NodeJS.ProcessEnv;
}): Promise<ReadinessReport> {
  const env = options.env ?? process.env;
  const items: ReadinessItem[] = [...evaluateEnquiryEnvReadiness(env)];

  // Prefer structured secret resolution when available (version awareness).
  const abuse = resolveAbuseHashSecrets(env);
  const abuseIdx = items.findIndex((item) => item.id === "env-abuse-secret");
  if (abuseIdx >= 0) {
    items[abuseIdx] = {
      id: "env-abuse-secret",
      ok: abuse != null,
      detail: abuse
        ? `Abuse HMAC secret configured (v${abuse.currentVersion})`
        : "ABUSE_HASH_SECRET missing",
    };
  }

  if (options.db) {
    const ledger = await options.db
      .collection(COLLECTION_NAMES.schemaMigrations)
      .findOne(
        { migrationId: MIGRATION_ID, status: "applied" },
        { projection: { migrationId: 1, status: 1 } },
      );
    items.push({
      id: "migration-ledger",
      ok: Boolean(ledger),
      detail: ledger
        ? "Step 45 migration marked applied"
        : "Required schema migration not applied",
    });

    for (const critical of CRITICAL_INDEXES) {
      let ok = false;
      try {
        const indexes = await options.db
          .collection(critical.collection)
          .indexes();
        ok = indexes.some((index) => index.name === critical.indexName);
      } catch {
        ok = false;
      }
      items.push({
        id: critical.checkId,
        ok,
        detail: ok
          ? `Index ${critical.indexName} present`
          : `Critical index ${critical.indexName} missing`,
      });
    }
  } else {
    items.push({
      id: "migration-ledger",
      ok: false,
      detail: "Database handle not provided for ledger check",
    });
    items.push({
      id: "index-enquiries-idempotency",
      ok: false,
      detail: "Database handle not provided for index check",
    });
    items.push({
      id: "index-rate-limit-ttl",
      ok: false,
      detail: "Database handle not provided for index check",
    });
  }

  const ready = items.every((item) => item.ok);
  return {
    ready,
    checkedAt: new Date().toISOString(),
    items,
  };
}
