"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { usePathname } from "next/navigation";
import { ButtonLink } from "@/components/ui/button-link";
import type {
  HeaderNavigation,
  NavDestination,
  ServicesNav,
} from "@/config/navigation";
import {
  HeaderNavLink,
  PlannedNavLabel,
} from "@/components/layout/header-nav-link";
import { DESKTOP_NAV_MEDIA } from "@/lib/navigation";
import { cn } from "@/lib/cn";

type CloseReason = "dismiss" | "navigate" | "breakpoint";

function isModifiedClick(event: MouseEvent<HTMLElement>): boolean {
  return (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

function isElementVisible(element: HTMLElement): boolean {
  return element.getClientRects().length > 0;
}

export function MobileNavigation({
  idPrefix,
  home,
  items,
  services,
  cta,
  pathnameOverride,
  fallbackFocusId,
  hideTriggerOnDesktop = true,
}: HeaderNavigation & {
  idPrefix: string;
  home: NavDestination;
  pathnameOverride?: string;
  fallbackFocusId: string;
  hideTriggerOnDesktop?: boolean;
}) {
  const livePath = usePathname();
  const pathname = pathnameOverride ?? livePath;
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeReasonRef = useRef<CloseReason>("dismiss");
  const lastPathRef = useRef(livePath);
  const isMountedRef = useRef(true);

  const dialogId = `${idPrefix}-mobile-dialog`;
  const titleId = `${idPrefix}-mobile-title`;

  const applyFocusPolicy = useCallback(
    (reason: CloseReason) => {
      if (reason === "navigate") {
        triggerRef.current?.blur();
        return;
      }

      if (reason === "breakpoint") {
        document
          .getElementById(fallbackFocusId)
          ?.focus({ preventScroll: true });
        return;
      }

      const trigger = triggerRef.current;
      if (trigger && isElementVisible(trigger)) {
        trigger.focus({ preventScroll: true });
        return;
      }

      document.getElementById(fallbackFocusId)?.focus({ preventScroll: true });
    },
    [fallbackFocusId],
  );

  const closeMenu = useCallback(
    (reason: CloseReason) => {
      closeReasonRef.current = reason;
      const dialog = dialogRef.current;
      if (dialog?.open) {
        dialog.close();
        return;
      }
      setOpen(false);
      applyFocusPolicy(reason);
    },
    [applyFocusPolicy],
  );

  function openMenu() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) {
      return;
    }
    closeReasonRef.current = "dismiss";
    dialog.showModal();
    setOpen(true);
  }

  function onMaybeNavigate(event: MouseEvent<HTMLAnchorElement>) {
    if (isModifiedClick(event)) {
      return;
    }
    closeMenu("navigate");
  }

  function onDialogClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      closeMenu("dismiss");
    }
  }

  function onNativeCancel() {
    closeReasonRef.current = "dismiss";
  }

  function onNativeClose() {
    if (isMountedRef.current) {
      setOpen(false);
      applyFocusPolicy(closeReasonRef.current);
    }
    closeReasonRef.current = "dismiss";
  }

  useEffect(() => {
    if (!open || !dialogRef.current?.open) {
      return;
    }
    const body = document.body;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (livePath === lastPathRef.current) {
      return;
    }
    lastPathRef.current = livePath;
    if (dialogRef.current?.open) {
      closeMenu("navigate");
    }
  }, [livePath, closeMenu]);

  useEffect(() => {
    if (!hideTriggerOnDesktop) {
      return;
    }

    const media = window.matchMedia(DESKTOP_NAV_MEDIA);
    function onBreakpointChange() {
      if (media.matches && dialogRef.current?.open) {
        closeMenu("breakpoint");
      }
    }

    media.addEventListener("change", onBreakpointChange);
    return () => media.removeEventListener("change", onBreakpointChange);
  }, [closeMenu, hideTriggerOnDesktop]);

  useEffect(() => {
    isMountedRef.current = true;
    const dialog = dialogRef.current;
    return () => {
      isMountedRef.current = false;
      if (dialog?.open) {
        dialog.close();
      }
    };
  }, []);

  const hasServices = Boolean(
    services?.overview || (services && services.categories.length > 0),
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={cn(
          "inline-flex min-h-11 items-center rounded-sm px-3 py-2 text-base font-medium text-ink hover:text-brand-strong",
          hideTriggerOnDesktop && "lg:hidden",
        )}
        aria-expanded={open}
        aria-controls={dialogId}
        aria-haspopup="dialog"
        onClick={openMenu}
      >
        Menu
      </button>
      <dialog
        ref={dialogRef}
        id={dialogId}
        className="mobile-nav-dialog"
        aria-labelledby={titleId}
        onClick={onDialogClick}
        onCancel={onNativeCancel}
        onClose={onNativeClose}
      >
        <div className="mobile-nav-panel">
          <div className="flex items-start justify-between gap-3">
            <h2 id={titleId} className="min-w-0 text-lg font-semibold">
              Site navigation
            </h2>
            <button
              type="button"
              className="inline-flex min-h-11 shrink-0 items-center rounded-sm px-3 py-2 text-base font-medium text-ink hover:text-brand-strong"
              onClick={() => closeMenu("dismiss")}
            >
              Close menu
            </button>
          </div>
          <nav aria-label="Primary" className="mt-6">
            <ul className="m-0 flex list-none flex-col gap-1 p-0">
              <li className="min-w-0">
                <HeaderNavLink
                  item={home}
                  pathname={pathname}
                  onNavigate={onMaybeNavigate}
                />
              </li>
              {hasServices && services ? (
                <MobileServices
                  services={services}
                  pathname={pathname}
                  onNavigate={onMaybeNavigate}
                />
              ) : null}
              {items.map((item) => (
                <li key={item.id} className="min-w-0">
                  <HeaderNavLink
                    item={item}
                    pathname={pathname}
                    onNavigate={onMaybeNavigate}
                  />
                </li>
              ))}
              {cta ? (
                <li className="mt-4 min-w-0">
                  {cta.implemented ? (
                    <ButtonLink
                      href={cta.path}
                      className="w-full"
                      onClick={onMaybeNavigate}
                    >
                      {cta.label}
                    </ButtonLink>
                  ) : (
                    <PlannedNavLabel label={cta.label} />
                  )}
                </li>
              ) : null}
            </ul>
          </nav>
        </div>
      </dialog>
    </>
  );
}

function MobileServices({
  services,
  pathname,
  onNavigate,
}: {
  services: ServicesNav;
  pathname: string;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const { overview, categories } = services;

  return (
    <li className="min-w-0">
      {overview ? (
        <HeaderNavLink
          item={overview}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      ) : null}
      {categories.length > 0 ? (
        <details className="mt-1">
          <summary className="min-h-11 cursor-pointer py-2 text-base font-medium text-ink">
            Service categories
          </summary>
          <ul className="mt-1 list-none p-0 pl-3">
            {categories.map((item) => (
              <li key={item.id} className="min-w-0">
                <HeaderNavLink
                  item={item}
                  pathname={pathname}
                  onNavigate={onNavigate}
                />
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </li>
  );
}
