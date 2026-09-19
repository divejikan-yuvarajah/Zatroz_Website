"use client";

import { useEffect, useId, useRef, useState } from "react";
import { TURNSTILE_ENQUIRY_ACTION } from "@/lib/security/turnstile";

const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("no-window"));
  }
  if (window.turnstile) {
    return Promise.resolve();
  }
  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src^="https://challenges.cloudflare.com/turnstile/"]',
    );
    if (existing) {
      const done = () => resolve();
      existing.addEventListener("load", done, { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("script-error")),
        { once: true },
      );
      if (window.turnstile) {
        resolve();
      }
      return;
    }

    const script = document.createElement("script");
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("script-error"));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export type TurnstileChallengeProps = {
  siteKey: string;
  disabled?: boolean;
  /** Increment to remount/reset the widget (e.g. after token expiry or retry). */
  resetSignal?: number;
  onTokenChange: (token: string | null) => void;
  onReadyChange?: (ready: boolean) => void;
};

export function TurnstileChallenge({
  siteKey,
  disabled = false,
  resetSignal = 0,
  onTokenChange,
  onReadyChange,
}: TurnstileChallengeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const statusId = useId();

  useEffect(() => {
    if (disabled) {
      onTokenChange(null);
      onReadyChange?.(false);
      return;
    }

    let cancelled = false;

    async function mountWidget() {
      setLoadState("loading");
      try {
        await loadTurnstileScript();
        if (cancelled || !containerRef.current || !window.turnstile) {
          setLoadState("error");
          onTokenChange(null);
          onReadyChange?.(false);
          return;
        }

        if (widgetIdRef.current) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action: TURNSTILE_ENQUIRY_ACTION,
          theme: "light",
          callback: (token: string) => {
            if (cancelled) return;
            onTokenChange(token);
            onReadyChange?.(true);
            setLoadState("ready");
          },
          "expired-callback": () => {
            if (cancelled) return;
            onTokenChange(null);
            onReadyChange?.(false);
            setLoadState("loading");
          },
          "error-callback": () => {
            if (cancelled) return;
            onTokenChange(null);
            onReadyChange?.(false);
            setLoadState("error");
          },
        });
      } catch {
        if (!cancelled) {
          setLoadState("error");
          onTokenChange(null);
          onReadyChange?.(false);
        }
      }
    }

    void mountWidget();

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, resetSignal, disabled, onTokenChange, onReadyChange]);

  const statusText =
    loadState === "error"
      ? "Security check unavailable. Try again or use email / WhatsApp below."
      : loadState === "ready"
        ? "Security check complete."
        : "Loading security check…";

  return (
    <div className="space-y-2">
      <p id={statusId} className="m-0 text-sm text-text-muted">
        {statusText}
      </p>
      <div
        ref={containerRef}
        aria-labelledby={statusId}
        aria-busy={loadState === "loading"}
      />
    </div>
  );
}
