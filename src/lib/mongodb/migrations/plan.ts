/**
 * Read-only migration planning against a live database.
 * Never prints credentials or document bodies.
 */

import type { Db, IndexDescription } from "mongodb";
import {
  COLLECTION_SCHEMAS,
  MIGRATION_ID,
  schemaPlanChecksum,
  type CollectionSchemaSpec,
  type NamedIndex,
} from "@/lib/mongodb/schema/definitions";
import { COLLECTION_NAMES } from "@/lib/mongodb/collections";

export type IndexPlanAction =
  | { action: "create"; index: NamedIndex }
  | { action: "match"; index: NamedIndex }
  | {
      action: "conflict";
      index: NamedIndex;
      detail: string;
    };

export type CollectionPlan = Readonly<{
  name: string;
  collectionExists: boolean;
  validatorAction: "create" | "match" | "update" | "inspect-incompatible";
  validatorDetail: string;
  indexes: readonly IndexPlanAction[];
  rollbackNote: string;
}>;

export type MigrationPlan = Readonly<{
  migrationId: string;
  checksum: string;
  targetLabel: string;
  collections: readonly CollectionPlan[];
  ledgerStatus: "missing" | "applied" | "in_progress" | "checksum-mismatch";
}>;

function indexKeyEqual(
  a: IndexSpecificationLike,
  b: IndexSpecificationLike,
): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

type IndexSpecificationLike = Record<string, unknown> | [string, number][];

function normalizeIndexKey(
  key: IndexDescription["key"],
): IndexSpecificationLike {
  return key as IndexSpecificationLike;
}

async function planCollection(
  db: Db,
  spec: CollectionSchemaSpec,
): Promise<CollectionPlan> {
  const existingNames = await db.listCollections({ name: spec.name }).toArray();
  const collectionExists = existingNames.length > 0;

  if (!collectionExists) {
    return {
      name: spec.name,
      collectionExists: false,
      validatorAction: "create",
      validatorDetail: "Collection will be created with validator.",
      indexes: spec.indexes.map((index) => ({ action: "create", index })),
      rollbackNote: spec.rollbackNote,
    };
  }

  const collection = db.collection(spec.name);
  const infos = await db
    .listCollections({ name: spec.name }, { nameOnly: false })
    .toArray();
  const info = infos[0] as { options?: { validator?: unknown } } | undefined;
  const hasValidator = Boolean(info?.options?.validator);

  let validatorAction: CollectionPlan["validatorAction"] = "update";
  let validatorDetail =
    "Validator will be set/replaced via collMod (inspect existing data first).";
  if (!hasValidator) {
    validatorAction = "create";
    validatorDetail = "Existing collection has no validator; will attach one.";
  } else {
    validatorAction = "update";
    validatorDetail =
      "Existing validator present; apply will collMod to the Step 45 schema after compatibility inspection.";
  }

  const existingIndexes = await collection.indexes();
  const indexPlans: IndexPlanAction[] = [];

  for (const desired of spec.indexes) {
    const match = existingIndexes.find((idx) => idx.name === desired.name);
    if (!match) {
      const keyClash = existingIndexes.find(
        (idx) =>
          idx.name !== "_id_" &&
          indexKeyEqual(
            normalizeIndexKey(idx.key),
            desired.key as IndexSpecificationLike,
          ),
      );
      if (keyClash) {
        indexPlans.push({
          action: "conflict",
          index: desired,
          detail: `Same key exists under different name "${keyClash.name}". Stop — do not drop indexes automatically.`,
        });
      } else {
        indexPlans.push({ action: "create", index: desired });
      }
      continue;
    }

    const sameKey = indexKeyEqual(
      normalizeIndexKey(match.key),
      desired.key as IndexSpecificationLike,
    );
    const desiredUnique = Boolean(desired.options?.unique);
    const existingUnique = Boolean(match.unique);
    const desiredTtl = desired.options?.expireAfterSeconds;
    const existingTtl = match.expireAfterSeconds;

    if (
      !sameKey ||
      desiredUnique !== existingUnique ||
      (desiredTtl !== undefined && desiredTtl !== existingTtl)
    ) {
      indexPlans.push({
        action: "conflict",
        index: desired,
        detail:
          "Index name exists with incompatible options/key. Stop — never drop to force success.",
      });
    } else {
      indexPlans.push({ action: "match", index: desired });
    }
  }

  return {
    name: spec.name,
    collectionExists: true,
    validatorAction,
    validatorDetail,
    indexes: indexPlans,
    rollbackNote: spec.rollbackNote,
  };
}

export async function buildMigrationPlan(
  db: Db,
  targetLabel: string,
): Promise<MigrationPlan> {
  const collections: CollectionPlan[] = [];
  for (const spec of COLLECTION_SCHEMAS) {
    collections.push(await planCollection(db, spec));
  }

  const ledger = db.collection(COLLECTION_NAMES.schemaMigrations);
  const ledgerDoc = await ledger.findOne({ migrationId: MIGRATION_ID });
  const checksum = schemaPlanChecksum();

  let ledgerStatus: MigrationPlan["ledgerStatus"] = "missing";
  if (ledgerDoc) {
    if (ledgerDoc.status === "in_progress") {
      ledgerStatus = "in_progress";
    } else if (ledgerDoc.checksum !== checksum) {
      ledgerStatus = "checksum-mismatch";
    } else if (ledgerDoc.status === "applied") {
      ledgerStatus = "applied";
    }
  }

  return {
    migrationId: MIGRATION_ID,
    checksum,
    targetLabel,
    collections,
    ledgerStatus,
  };
}

export function planHasConflicts(plan: MigrationPlan): boolean {
  return plan.collections.some((collection) =>
    collection.indexes.some((index) => index.action === "conflict"),
  );
}

export function planIsNoOp(plan: MigrationPlan): boolean {
  if (plan.ledgerStatus !== "applied") return false;
  return plan.collections.every(
    (collection) =>
      collection.collectionExists &&
      collection.indexes.every((index) => index.action === "match"),
  );
}

export function formatPlanForCli(plan: MigrationPlan): string {
  const lines: string[] = [
    `Migration: ${plan.migrationId}`,
    `Checksum: ${plan.checksum}`,
    `Target label: ${plan.targetLabel}`,
    `Ledger: ${plan.ledgerStatus}`,
    "",
  ];

  for (const collection of plan.collections) {
    lines.push(`Collection ${collection.name}`);
    lines.push(
      `  exists=${collection.collectionExists} validator=${collection.validatorAction}`,
    );
    lines.push(`  ${collection.validatorDetail}`);
    for (const index of collection.indexes) {
      if (index.action === "conflict") {
        lines.push(`  index ${index.index.name}: CONFLICT — ${index.detail}`);
      } else {
        lines.push(`  index ${index.index.name}: ${index.action}`);
      }
    }
    lines.push(`  rollback: ${collection.rollbackNote}`);
    lines.push("");
  }

  return lines.join("\n");
}
