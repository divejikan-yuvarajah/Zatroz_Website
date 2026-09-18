import "server-only";

/**
 * Server-only MongoDB accessors for Next.js Server Components / Route Handlers.
 * Scripts should import `@/lib/mongodb/connection` instead of this module.
 */

export {
  closeMongoClient,
  getDb,
  getMongoClient,
  pingMongo,
  MONGODB_POOL,
  MONGODB_TIMEOUTS_MS,
  type MongoPingResult,
} from "@/lib/mongodb/connection";

export {
  isMongoRuntimeConfigured,
  mongoConfigLabel,
  resolveMongoRuntimeConfig,
  sanitizeMongoError,
  type MongoRuntimeConfig,
} from "@/lib/mongodb/config";
