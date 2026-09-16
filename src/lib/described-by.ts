/**
 * Join aria-describedby tokens. Drops empties and duplicates.
 * Returns undefined when nothing is referenced so the attribute is omitted.
 */
export function mergeDescribedBy(
  ...parts: Array<string | undefined | null>
): string | undefined {
  const tokens: string[] = [];
  const seen = new Set<string>();

  for (const part of parts) {
    if (!part) continue;
    for (const token of part.split(/\s+/)) {
      if (!token || seen.has(token)) continue;
      seen.add(token);
      tokens.push(token);
    }
  }

  return tokens.length > 0 ? tokens.join(" ") : undefined;
}
