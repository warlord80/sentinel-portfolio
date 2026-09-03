"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";

interface HeroEntranceProps {
  children: ReactNode;
  className?: string;
}

/**
 * Hero entrance sequence — runs once on page load. Staggers the hero
 * elements (tag → heading → description → buttons) into view with a
 * deliberate, premium cadence. Disabled when prefers-reduced-motion
 * is active.
 */
export function HeroEntrance({ children, className }: HeroEntranceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const children = Array.from(el.children);

    gsap.set(children, { opacity: 0, y: 30 });

    tweenRef.current = gsap.to(children, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.15,
      delay: 0.3,
      ease: "power3.out",
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
