import { safeBoundaryFields } from "@/lib/observability/redact";

/**
 * Safe boundary diagnostics — never log Error.message bodies that may contain
 * enquiry fields, tokens, or stack traces in application logs.
 * Reporting failures must not crash the error fallback.
 */
export function logBoundaryError(
  scope: string,
  error: Error & { digest?: string },
): void {
  try {
    const fields = safeBoundaryFields({
      scope,
      name: error.name,
      digest: error.digest,
    });
    console.error(
      `[${fields.scope}] boundary digest=${fields.digest} name=${fields.name}`,
    );
  } catch {
    console.error("[boundary] digest=redacted name=redacted");
  }
}
