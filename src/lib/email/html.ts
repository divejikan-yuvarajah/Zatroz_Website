/**
 * HTML escaping and bounded text for email templates.
 */

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Bound visitor text for email bodies; preserves newlines as text. */
export function boundText(value: string, maxLength: number): string {
  const normalized = value.replace(/\r\n/g, "\n").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, Math.max(0, maxLength - 1))}…`;
}

/** Escape + convert newlines to <br> for HTML bodies. */
export function escapeHtmlWithBreaks(value: string): string {
  return escapeHtml(value).replace(/\n/g, "<br />\n");
}
