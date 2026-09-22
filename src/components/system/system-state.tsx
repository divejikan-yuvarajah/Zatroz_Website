import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import type { ButtonVariant } from "@/components/ui/button-styles";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { TextLink } from "@/components/ui/text-link";
import { publicRoutes } from "@/config/routes";
import { cn } from "@/lib/cn";

export type SystemStateAction = {
  label: string;
  href: string;
  variant?: ButtonVariant;
};

export type SystemStateProps = {
  title: string;
  description: string;
  /** Optional correlation token for support — never an Error.message. */
  digest?: string | null;
  primaryAction?: SystemStateAction;
  secondaryActions?: readonly SystemStateAction[];
  /** Client-only retry for failed reads/renders — never a mutation. */
  onRetry?: () => void;
  retryLabel?: string;
  headingLevel?: 1 | 2;
  idPrefix?: string;
  className?: string;
};

/**
 * Shared public system-state layout (not-found, error, unavailable).
 * Copy stays fixed and safe — callers must not pass raw Error.message.
 */
export function SystemState({
  title,
  description,
  digest = null,
  primaryAction,
  secondaryActions = [],
  onRetry,
  retryLabel = "Try again",
  headingLevel = 1,
  idPrefix = "",
  className,
}: SystemStateProps) {
  const headingId = `${idPrefix}system-state-heading`;

  return (
    <Section
      as="section"
      surface="light"
      aria-labelledby={headingId}
      className={cn(className)}
    >
      <Container width="reading">
        <SectionHeading
          level={headingLevel}
          visualLevel={1}
          id={headingId}
          description={description}
        >
          {title}
        </SectionHeading>

        {digest ? (
          <p className="mt-4 m-0 text-sm text-text-muted">
            Reference: <code className="text-ink">{digest}</code>
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          {onRetry ? (
            <Button type="button" variant="primary" onClick={onRetry}>
              {retryLabel}
            </Button>
          ) : null}
          {primaryAction ? (
            <ButtonLink
              href={primaryAction.href}
              variant={primaryAction.variant ?? "primary"}
            >
              {primaryAction.label}
            </ButtonLink>
          ) : null}
          {secondaryActions.map((action) => (
            <ButtonLink
              key={action.href + action.label}
              href={action.href}
              variant={action.variant ?? "secondary"}
            >
              {action.label}
            </ButtonLink>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/** Stable recovery destinations that are actually implemented. */
export function getPublicRecoveryLinks(): readonly SystemStateAction[] {
  const links: SystemStateAction[] = [
    { label: "Home", href: publicRoutes.home.path, variant: "primary" },
  ];
  if (publicRoutes.services.implemented) {
    links.push({
      label: "Services",
      href: publicRoutes.services.path,
      variant: "secondary",
    });
  }
  if (publicRoutes.work.implemented) {
    links.push({
      label: "Work",
      href: publicRoutes.work.path,
      variant: "secondary",
    });
  }
  if (publicRoutes.contact.implemented) {
    links.push({
      label: "Contact",
      href: publicRoutes.contact.path,
      variant: "secondary",
    });
  }
  return links;
}

export function PublicNotFoundState({
  headingLevel = 1,
  idPrefix = "",
}: {
  headingLevel?: 1 | 2;
  idPrefix?: string;
}) {
  const [home, ...rest] = getPublicRecoveryLinks();
  return (
    <SystemState
      title="Page not found"
      description="That address is not available on this site. It may be mistyped, moved, or not published yet."
      primaryAction={home}
      secondaryActions={rest}
      headingLevel={headingLevel}
      idPrefix={idPrefix}
    />
  );
}

export function PublicErrorState({
  digest,
  onRetry,
  headingLevel = 1,
  idPrefix = "",
}: {
  digest?: string | null;
  onRetry?: () => void;
  headingLevel?: 1 | 2;
  idPrefix?: string;
}) {
  const [home, ...rest] = getPublicRecoveryLinks();
  return (
    <SystemState
      title="Something went wrong"
      description="This page could not be loaded right now. Your enquiry was not sent again by this message. You can try once more, or use another page."
      digest={digest}
      onRetry={onRetry}
      primaryAction={onRetry ? undefined : home}
      secondaryActions={onRetry ? [home, ...rest] : rest}
      headingLevel={headingLevel}
      idPrefix={idPrefix}
    />
  );
}

export function PublicUnavailableState({
  title = "Temporarily unavailable",
  description = "We could not load this content from the server right now. This is not the same as an empty list — please try again shortly, or contact us if you need help.",
  onRetry,
  headingLevel = 1,
  idPrefix = "",
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  headingLevel?: 1 | 2;
  idPrefix?: string;
}) {
  const contact = publicRoutes.contact.implemented
    ? ({
        label: "Contact",
        href: publicRoutes.contact.path,
        variant: "secondary" as const,
      } satisfies SystemStateAction)
    : null;
  return (
    <SystemState
      title={title}
      description={description}
      onRetry={onRetry}
      secondaryActions={contact ? [contact] : []}
      headingLevel={headingLevel}
      idPrefix={idPrefix}
    />
  );
}

/** Inline unavailable note for list sections (Work). */
export function InlineUnavailableNotice({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mt-10 max-w-reading rounded-sm border border-border-subtle bg-surface-muted px-5 py-4",
        className,
      )}
      role="status"
    >
      <p className="m-0 font-medium text-ink">
        Portfolio temporarily unavailable
      </p>
      <p className="mt-2 m-0 text-sm text-text-body">
        We could not reach the project catalogue just now. This is a service
        problem, not an empty portfolio. Please try again shortly
        {publicRoutes.contact.implemented ? (
          <>
            {" "}
            or <TextLink href={publicRoutes.contact.path}>contact us</TextLink>
          </>
        ) : null}
        .
      </p>
    </div>
  );
}
