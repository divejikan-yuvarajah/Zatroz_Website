"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type FocusEvent,
} from "react";
import type { NavDestination } from "@/config/navigation";
import { HeaderNavLink } from "@/components/layout/header-nav-link";

export function ServicesDisclosure({
  idPrefix,
  pathname,
  overview,
  categories,
}: {
  idPrefix: string;
  pathname: string;
  overview: NavDestination | null;
  categories: NavDestination[];
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = `${idPrefix}-services-panel`;
  const showToggle = categories.length > 0;

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      const target = event.target;
      if (
        target instanceof Node &&
        rootRef.current &&
        !rootRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Escape" || !open) return;
    event.preventDefault();
    setOpen(false);
    buttonRef.current?.focus();
  }

  function onBlur(event: FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget;
    if (next instanceof Node && rootRef.current?.contains(next)) {
      return;
    }
    setOpen(false);
  }

  if (!overview && categories.length === 0) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      className="relative flex flex-wrap items-center gap-1"
      onKeyDown={onKeyDown}
      onBlur={onBlur}
    >
      {overview ? <HeaderNavLink item={overview} pathname={pathname} /> : null}
      {showToggle ? (
        <>
          <button
            ref={buttonRef}
            type="button"
            className="inline-flex min-h-11 items-center rounded-sm px-2 py-2 text-base font-medium text-ink hover:text-brand-strong"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
          >
            Show service categories
          </button>
          <ul
            id={panelId}
            hidden={!open}
            className="absolute left-0 top-full z-[50] mt-2 min-w-56 max-w-[min(24rem,calc(100vw-2rem))] list-none rounded-md border border-border-subtle bg-surface p-3 shadow-soft"
          >
            {categories.map((item) => (
              <li key={item.id} className="min-w-0">
                <HeaderNavLink
                  item={item}
                  pathname={pathname}
                  onNavigate={() => setOpen(false)}
                />
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
