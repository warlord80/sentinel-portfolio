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
  /** Whether the element has already been revealed (prevents flash) */
  reveal?: boolean;
}

/**
 * Generic scroll-triggered reveal wrapper. Fades + slides content into view
 * when it crosses the scroll threshold. Uses a subtle ease-out with slight
 * scale for a more premium feel. Disabled entirely when the user prefers
 * reduced motion.
 */
export function Reveal({
  children,
  delay = 0,
  duration = 0.9,
  y = 30,
  className,
  stagger = 0,
  reveal = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!reveal) return;
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const targets = stagger > 0 ? Array.from(el.children) : [el];

    gsap.set(targets, { opacity: 0, y, scale: 0.99 });

    const trig = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration,
          delay,
          stagger: stagger > 0 ? stagger : undefined,
          ease: "expo.out",
          overwrite: "auto",
        });
      },
    });

    return () => {
      trig.kill();
    };
  }, [delay, duration, y, stagger, reveal]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
