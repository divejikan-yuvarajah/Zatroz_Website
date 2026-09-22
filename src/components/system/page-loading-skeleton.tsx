import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/cn";

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-sm bg-surface-muted motion-reduce:animate-none",
        className,
      )}
      aria-hidden="true"
    />
  );
}

/**
 * Restrained route loading shell. Decorative skeletons are hidden from AT;
 * a concise status describes the wait.
 */
export function PageLoadingSkeleton({
  label = "Loading page",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <Section
      as="section"
      surface="light"
      className={className}
      aria-busy="true"
    >
      <Container>
        <p className="sr-only" role="status">
          {label}
        </p>
        <SkeletonBlock className="h-4 w-40" />
        <SkeletonBlock className="mt-8 h-10 w-3/4 max-w-md" />
        <SkeletonBlock className="mt-4 h-4 w-full max-w-reading" />
        <SkeletonBlock className="mt-2 h-4 w-5/6 max-w-reading" />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonBlock className="h-48 w-full" />
          <SkeletonBlock className="h-48 w-full" />
          <SkeletonBlock className="h-48 w-full" />
        </div>
      </Container>
    </Section>
  );
}
