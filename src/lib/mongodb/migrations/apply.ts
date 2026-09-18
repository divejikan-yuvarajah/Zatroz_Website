/**
 * Apply schema/index migrations safely to an approved non-production database.
 * DDL is not one all-or-nothing transaction — resume inspects actual state.
 */

import { MongoClient, type Db } from "mongodb";
import { COLLECTION_NAMES } from "@/lib/mongodb/collections";
import {
  COLLECTION_SCHEMAS,
  MIGRATION_ID,
  schemaPlanChecksum,
} from "@/lib/mongodb/schema/definitions";
import {
  assertNonProductionApply,
  resolveMigrationEnv,
  type MigrationTarget,
} from "@/lib/mongodb/migrations/env";
import {
  buildMigrationPlan,
  formatPlanForCli,
  planHasConflicts,
  planIsNoOp,
  type MigrationPlan,
} from "@/lib/mongodb/migrations/plan";

export type ApplyResult =
  | {
      ok: true;
      mode: "no-op" | "applied" | "resumed";
      plan: MigrationPlan;
      message: string;
    }
  | {
      ok: false;
      plan?: MigrationPlan;
      message: string;
    };

const LOCK_ID = "schema-migration-lock";

async function acquireLock(db: Db): Promise<boolean> {
  const locks = db.collection(COLLECTION_NAMES.schemaMigrationLock);
  try {
    await locks.createIndex(
      { lockId: 1 },
      { unique: true, name: "uniq_migration_lock" },
    );
  } catch {
    // Index may already exist.
  }

  try {
    await locks.insertOne({
      lockId: LOCK_ID,
      holder: `pid-${process.pid}`,
      acquiredAt: new Date(),
      migrationId: MIGRATION_ID,
    });
    return true;
  } catch {
    return false;
  }
}

async function releaseLock(db: Db): Promise<void> {
  await db
    .collection(COLLECTION_NAMES.schemaMigrationLock)
    .deleteOne({ lockId: LOCK_ID })
    .catch(() => undefined);
}

async function ensureCollectionWithValidator(
  db: Db,
  name: string,
  validator: Record<string, unknown>,
): Promise<void> {
  const existing = await db.listCollections({ name }).toArray();
  if (existing.length === 0) {
    await db.createCollection(name, {
      validator,
      validationLevel: "strict",
      validationAction: "error",
    });
    return;
  }

  await db.command({
    collMod: name,
    validator,
    validationLevel: "strict",
    validationAction: "error",
  });
}

async function ensureIndexes(
  db: Db,
  plan: MigrationPlan,
): Promise<{ ok: true } | { ok: false; message: string }> {
  for (const collectionPlan of plan.collections) {
    const collection = db.collection(collectionPlan.name);
    for (const indexPlan of collectionPlan.indexes) {
      if (indexPlan.action === "match") continue;
      if (indexPlan.action === "conflict") {
        return {
          ok: false,
          message: `Index conflict on ${collectionPlan.name}.${indexPlan.index.name}: ${indexPlan.detail}`,
        };
      }
      try {
        await collection.createIndex(indexPlan.index.key, {
          name: indexPlan.index.name,
          ...(indexPlan.index.options ?? {}),
        });
      } catch (error) {
        const name =
          error && typeof error === "object" && "codeName" in error
            ? String((error as { codeName: unknown }).codeName)
            : "Error";
        return {
          ok: false,
          message: `Failed creating index ${indexPlan.index.name} on ${collectionPlan.name} (${name}). Duplicate values or incompatible options — stop without dropping data.`,
        };
      }
    }
  }
  return { ok: true };
}

export async function applyMigration(options: {
  target: string;
  env?: NodeJS.ProcessEnv;
}): Promise<ApplyResult> {
  const resolved = resolveMigrationEnv(options.env);
  if (!resolved.ok) {
    return {
      ok: false,
      message: `Migration env incomplete: ${resolved.issues.join(" ")}`,
    };
  }

  const refusal = assertNonProductionApply(
    options.target,
    resolved.config.appEnv,
  );
  if (refusal) {
    return { ok: false, message: refusal };
  }

  const target = options.target as MigrationTarget;
  const client = new MongoClient(resolved.config.uri, {
    maxPoolSize: 3,
    serverSelectionTimeoutMS: 8_000,
    connectTimeoutMS: 8_000,
  });

  try {
    await client.connect();
    const db = client.db(resolved.config.dbName);
    const targetLabel = `appEnv=${resolved.config.appEnv}; db=${resolved.config.dbName}; target=${target}`;

    const locked = await acquireLock(db);
    if (!locked) {
      return {
        ok: false,
        message:
          "Could not acquire migration lock — another apply may be running.",
      };
    }

    try {
      let plan = await buildMigrationPlan(db, targetLabel);

      if (planHasConflicts(plan)) {
        return {
          ok: false,
          plan,
          message:
            "Plan has index conflicts. Resolve manually; never drop indexes automatically.\n" +
            formatPlanForCli(plan),
        };
      }

      if (planIsNoOp(plan)) {
        return {
          ok: true,
          mode: "no-op",
          plan,
          message: "Schema already matches — no-op.",
        };
      }

      const ledger = db.collection(COLLECTION_NAMES.schemaMigrations);
      const checksum = schemaPlanChecksum();
      const resumed = plan.ledgerStatus === "in_progress";

      await ledger.updateOne(
        { migrationId: MIGRATION_ID },
        {
          $set: {
            migrationId: MIGRATION_ID,
            checksum,
            status: "in_progress",
            targetLabel,
            updatedAt: new Date(),
          },
          $setOnInsert: { startedAt: new Date() },
        },
        { upsert: true },
      );

      for (const spec of COLLECTION_SCHEMAS) {
        await ensureCollectionWithValidator(db, spec.name, spec.validator);
      }

      // Re-plan indexes after validators so resume sees actual state.
      plan = await buildMigrationPlan(db, targetLabel);
      if (planHasConflicts(plan)) {
        return {
          ok: false,
          plan,
          message:
            "Conflicts detected after validator apply.\n" +
            formatPlanForCli(plan),
        };
      }

      const indexResult = await ensureIndexes(db, plan);
      if (!indexResult.ok) {
        return { ok: false, plan, message: indexResult.message };
      }

      await ledger.updateOne(
        { migrationId: MIGRATION_ID },
        {
          $set: {
            status: "applied",
            checksum,
            appliedAt: new Date(),
            targetLabel,
          },
        },
      );

      plan = await buildMigrationPlan(db, targetLabel);

      return {
        ok: true,
        mode: resumed ? "resumed" : "applied",
        plan,
        message: resumed
          ? "Resumed partial migration and completed successfully."
          : "Migration applied successfully.",
      };
    } finally {
      await releaseLock(db);
    }
  } catch (error) {
    const name =
      error && typeof error === "object" && "name" in error
        ? String((error as { name: unknown }).name)
        : "Error";
    return {
      ok: false,
      message: `Migration apply failed (${name}). Details omitted; inspect Atlas/logs privately.`,
    };
  } finally {
    await client.close().catch(() => undefined);
  }
}

export async function planMigration(options: {
  env?: NodeJS.ProcessEnv;
}): Promise<
  | { ok: true; plan: MigrationPlan; text: string }
  | { ok: false; message: string }
> {
  const resolved = resolveMigrationEnv(options.env);
  if (!resolved.ok) {
    return {
      ok: false,
      message: `Migration env incomplete: ${resolved.issues.join(" ")}`,
    };
  }

  const client = new MongoClient(resolved.config.uri, {
    maxPoolSize: 2,
    serverSelectionTimeoutMS: 8_000,
    connectTimeoutMS: 8_000,
  });

  try {
    await client.connect();
    const db = client.db(resolved.config.dbName);
    const targetLabel = `appEnv=${resolved.config.appEnv}; db=${resolved.config.dbName}`;
    const plan = await buildMigrationPlan(db, targetLabel);
    return { ok: true, plan, text: formatPlanForCli(plan) };
  } catch (error) {
    const name =
      error && typeof error === "object" && "name" in error
        ? String((error as { name: unknown }).name)
        : "Error";
    return {
      ok: false,
      message: `Migration plan failed (${name}).`,
    };
  } finally {
    await client.close().catch(() => undefined);
  }
}
