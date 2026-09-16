export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-gutter focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-brand focus:px-4 focus:py-3 focus:font-medium focus:text-ink"
    >
      Skip to content
    </a>
  );
}
