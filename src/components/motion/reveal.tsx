"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: ReactNode;
  /** ScrollTrigger trigger element selector — defaults to the wrapper div */
  trigger?: string;
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Duration of the animation (seconds) */
  duration?: number;
  /** Vertical offset to animate from (px) */
  y?: number;
  /** Additional className on the wrapper */
  className?: string;
  /** Stagger children by this amount (seconds). 0 = no stagger */
  stagger?: number;
}

/**
 * Generic scroll-triggered reveal wrapper. Fades + slides content into view
 * when it crosses the scroll threshold. Disabled entirely when the user
 * prefers reduced motion.
 */
export function Reveal({
  children,
  delay = 0,
  duration = 0.8,
  y = 40,
  className,
  stagger = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const targets = stagger > 0 ? el.children : [el];

    gsap.set(targets, { opacity: 0, y });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration,
          delay,
          stagger: stagger > 0 ? stagger : undefined,
          ease: "power3.out",
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [delay, duration, y, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
