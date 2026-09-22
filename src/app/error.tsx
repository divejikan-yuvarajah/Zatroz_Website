"use client";

import { useEffect } from "react";
import { PublicErrorState } from "@/components/system/system-state";
import { logBoundaryError } from "@/lib/system/log-boundary-error";

type SegmentErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

/**
 * Segment error boundary for the root app tree (below root layout).
 * Retry re-renders children only — it must not resubmit enquiries or mutations.
 */
export default function RootError({ error, retry }: SegmentErrorProps) {
  useEffect(() => {
    logBoundaryError("app/error", error);
  }, [error]);

  return (
    <PublicErrorState
      digest={error.digest ?? null}
      onRetry={() => {
        retry();
      }}
    />
  );
}
