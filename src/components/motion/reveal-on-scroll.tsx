"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Progressive enhancement: children stay visible without JS.
 * GSAP only adds a short transform stagger when motion is allowed.
 * matchMedia + useGSAP cleanup revert timelines and ScrollTriggers.
 */
export function RevealOnScroll({ children, className }: RevealOnScrollProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) {
        return;
      }

      const items = root.querySelectorAll<HTMLElement>("[data-reveal-item]");
      if (items.length === 0) {
        return;
      }

      const media = gsap.matchMedia();

      media.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          allowMotion: "(prefers-reduced-motion: no-preference)",
          finePointer: "(hover: hover) and (pointer: fine)",
          wideEnough: "(min-width: 640px)",
        },
        (context) => {
          if (
            context.conditions?.reduceMotion ||
            !context.conditions?.finePointer ||
            !context.conditions?.wideEnough
          ) {
            return;
          }

          gsap.fromTo(
            items,
            { y: 16 },
            {
              y: 0,
              duration: 0.45,
              ease: "power2.out",
              stagger: 0.09,
              immediateRender: false,
              clearProps: "transform",
              scrollTrigger: {
                trigger: root,
                start: "top 88%",
                once: true,
              },
            },
          );
        },
      );

      return () => {
        media.revert();
      };
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className={cn(className)}>
      {children}
    </div>
  );
}
