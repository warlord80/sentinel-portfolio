"use client";

import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LenisCtx = createContext<React.MutableRefObject<Lenis | null> | null>(null);

/** Access the Lenis instance from child components (e.g. Navigation). */
export function useLenis() {
  return useContext(LenisCtx);
}

/**
 * Smooth scroll provider — initialises Lenis for buttery-smooth scrolling
 * and wires it into GSAP ScrollTrigger so scroll-driven animations stay
 * perfectly synchronised. Respects prefers-reduced-motion by disabling
 * Lenis when the user signals a preference for reduced motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const ref = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });
    ref.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      ref.current = null;
      lenis.destroy();
      gsap.ticker.remove(rafCallback);
    };
  }, []);

  return <LenisCtx.Provider value={ref}>{children}</LenisCtx.Provider>;
}
