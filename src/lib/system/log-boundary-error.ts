/**
 * Safe boundary diagnostics — never log Error.message bodies that may contain
 * enquiry fields, tokens, or stack traces in application logs.
 */
export function logBoundaryError(
  scope: string,
  error: Error & { digest?: string },
): void {
  const digest = error.digest?.trim() || "none";
  const name = error.name?.trim() || "Error";
  console.error(`[${scope}] boundary digest=${digest} name=${name}`);
}
