/**
 * Request body / content-type bounds for enquiry submission helpers.
 * Used by tests and any future JSON boundary; Server Actions map equivalently.
 */

import {
  ALLOWED_JSON_CONTENT_TYPE_PATTERN,
  ENQUIRY_REQUEST_BODY_BUDGET_BYTES,
} from "@/lib/security/policy";

export type ContentTypeCheck =
  { ok: true } | { ok: false; reason: "missing" | "unsupported" };

export function checkJsonContentType(
  contentType: string | null | undefined,
): ContentTypeCheck {
  if (contentType == null || contentType.trim() === "") {
    return { ok: false, reason: "missing" };
  }
  const media = contentType.split(";")[0]?.trim() ?? "";
  const full = contentType.trim();
  if (
    ALLOWED_JSON_CONTENT_TYPE_PATTERN.test(full) ||
    media.toLowerCase() === "application/json"
  ) {
    // Allow bare application/json; charset only when utf-8 if present.
    if (full.includes("charset")) {
      if (!/charset\s*=\s*["']?utf-8["']?/i.test(full)) {
        return { ok: false, reason: "unsupported" };
      }
    }
    return { ok: true };
  }
  return { ok: false, reason: "unsupported" };
}

/**
 * Early reject using Content-Length when present and over budget.
 * Callers must still independently bound streamed bytes.
 */
export function checkContentLengthBudget(
  contentLength: string | null | undefined,
  budgetBytes: number = ENQUIRY_REQUEST_BODY_BUDGET_BYTES,
): { ok: true } | { ok: false; reason: "too-large" | "invalid" } {
  if (contentLength == null || contentLength.trim() === "") {
    return { ok: true };
  }
  if (!/^\d+$/.test(contentLength.trim())) {
    return { ok: false, reason: "invalid" };
  }
  const length = Number(contentLength.trim());
  if (!Number.isSafeInteger(length) || length < 0) {
    return { ok: false, reason: "invalid" };
  }
  if (length > budgetBytes) {
    return { ok: false, reason: "too-large" };
  }
  return { ok: true };
}

/**
 * Read a stream with a hard byte budget. Rejects when exceeded.
 * Does not use request.json() on an unbounded stream.
 */
export async function readBodyWithBudget(
  stream: ReadableStream<Uint8Array> | null,
  budgetBytes: number = ENQUIRY_REQUEST_BODY_BUDGET_BYTES,
): Promise<
  { ok: true; bytes: Uint8Array } | { ok: false; reason: "empty" | "too-large" }
> {
  if (!stream) {
    return { ok: false, reason: "empty" };
  }

  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value || value.byteLength === 0) continue;
      total += value.byteLength;
      if (total > budgetBytes) {
        await reader.cancel().catch(() => undefined);
        return { ok: false, reason: "too-large" };
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  if (total === 0) {
    return { ok: false, reason: "empty" };
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { ok: true, bytes };
}

export type JsonRootParseResult =
  | { ok: true; value: Record<string, unknown> }
  | {
      ok: false;
      reason: "invalid-json" | "root-not-object" | "unsupported-encoding";
    };

/**
 * Parse UTF-8 JSON object root only — reject arrays, primitives, invalid JSON.
 */
export function parseJsonObjectRoot(bytes: Uint8Array): JsonRootParseResult {
  let text: string;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return { ok: false, reason: "unsupported-encoding" };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text) as unknown;
  } catch {
    return { ok: false, reason: "invalid-json" };
  }

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, reason: "root-not-object" };
  }

  return { ok: true, value: parsed as Record<string, unknown> };
}

/**
 * Approximate serialized size of a Server Action enquiry payload.
 * Used to enforce the same 32 KiB budget without a raw HTTP body.
 */
export function estimateEnquiryPayloadBytes(
  payload: Record<string, unknown>,
): number {
  return new TextEncoder().encode(JSON.stringify(payload)).byteLength;
}

export function isWithinEnquiryPayloadBudget(
  payload: Record<string, unknown>,
  budgetBytes: number = ENQUIRY_REQUEST_BODY_BUDGET_BYTES,
): boolean {
  return estimateEnquiryPayloadBytes(payload) <= budgetBytes;
}
