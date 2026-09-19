"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: ReactNode;
  trigger?: string;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
  stagger?: number;
  reveal?: boolean;
}

/**
 * Scroll-triggered reveal: opacity 0→1, blur 8px→0, translateY 20px→0.
 * Reduced to 12px upward for cards (via stagger > 0).
 * Disabled when user prefers reduced motion.
 */
export function Reveal({
  children,
  delay = 0,
  duration = 0.6,
  y = 20,
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

    gsap.set(targets, { opacity: 0, y, filter: "blur(8px)", scale: 1 });

    const trig = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
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
