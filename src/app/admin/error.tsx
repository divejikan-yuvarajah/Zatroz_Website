"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { logBoundaryError } from "@/lib/system/log-boundary-error";

type AdminErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

/**
 * Admin console segment error UI. Safe copy only; digest for ops correlation.
 * Retry does not resubmit forms or replay mutations.
 */
export default function AdminError({ error, retry }: AdminErrorProps) {
  useEffect(() => {
    logBoundaryError("admin/error", error);
  }, [error]);

  return (
    <Section as="section" surface="light" aria-labelledby="admin-error-heading">
      <Container width="reading">
        <SectionHeading
          level={1}
          visualLevel={2}
          id="admin-error-heading"
          description="This admin view could not be loaded. Unsaved form values may be lost if the page has to remount. Try again, or return to the console home."
        >
          Admin view unavailable
        </SectionHeading>
        {error.digest ? (
          <p className="mt-4 m-0 text-sm text-text-muted">
            Reference: <code className="text-ink">{error.digest}</code>
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button type="button" variant="primary" onClick={() => retry()}>
            Try again
          </Button>
          <ButtonLink href="/admin" variant="secondary">
            Console home
          </ButtonLink>
          <ButtonLink href="/admin/login" variant="quiet">
            Sign in again
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
