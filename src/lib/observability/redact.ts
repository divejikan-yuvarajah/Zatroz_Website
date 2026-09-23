const SECRET_PATTERN =
  /canary|password|secret|token|bearer|mongodb(\+srv)?:\/\/|@/i;

/**
 * Keep diagnostic text to a short code. Anything that looks like a secret,
 * address, or free-text canary becomes a fixed placeholder.
 */
export function redactDiagnosticText(value: string, max = 80): string {
  const trimmed = value.trim().slice(0, max);
  if (!trimmed || SECRET_PATTERN.test(trimmed)) return "redacted";
  return trimmed;
}

export function safeBoundaryFields(input: {
  scope: string;
  name?: string;
  digest?: string;
}): { scope: string; name: string; digest: string } {
  return {
    scope: redactDiagnosticText(input.scope, 40),
    name: redactDiagnosticText(input.name || "Error", 40),
    digest: redactDiagnosticText(input.digest || "none", 64),
  };
}
