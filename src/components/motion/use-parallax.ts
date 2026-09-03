"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxOptions {
  /** Vertical movement amount in pixels */
  amount?: number;
  /** Speed multiplier — higher = more movement */
  speed?: number;
}

/**
 * Hook that applies subtle scroll parallax to an element. Moves it at a
 * different rate than the scroll, creating depth. Respects
 * prefers-reduced-motion.
 */
export function useParallax(
  ref: React.RefObject<HTMLElement | null>,
  options: ParallaxOptions = {},
) {
  const { amount = -40, speed = 1 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    gsap.set(el, { y: 0 });

    const trig = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      scrub: 1.5,
      onUpdate: (self) => {
        const progress = self.progress - 0.5;
        gsap.to(el, {
          y: progress * amount * speed,
          duration: 0.1,
          overwrite: "auto",
        });
      },
    });

    return () => {
      trig.kill();
    };
  }, [amount, speed, ref]);
}
