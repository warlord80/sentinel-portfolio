"use client";

import { useEffect, useRef } from "react";

/**
 * HeroCursor — custom gold ring cursor inside the hero only.
 * Desktop only, disabled on touch/reduced-motion.
 * Uses requestAnimationFrame for smooth following with easing.
 */
export function HeroCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: none)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches || rm.matches) return;

    const hero = document.getElementById("top");
    if (!hero) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    const glow = glowRef.current;
    if (!ring || !dot || !glow) return;

    let raf: number;
    let inside = false;

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (!inside) {
        inside = true;
        hero.classList.add("hero-active");
      }
    };

    const onLeave = () => {
      inside = false;
      hero.classList.remove("hero-active");
    };

    const tick = () => {
      const lerp = 0.15;
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * lerp;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * lerp;

      ring.style.left = `${ringPos.current.x}px`;
      ring.style.top = `${ringPos.current.y}px`;
      dot.style.left = `${mouse.current.x}px`;
      dot.style.top = `${mouse.current.y}px`;
      glow.style.left = `${mouse.current.x}px`;
      glow.style.top = `${mouse.current.y}px`;

      raf = requestAnimationFrame(tick);
    };

    hero.addEventListener("mousemove", onMove, { passive: true });
    hero.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
      hero.classList.remove("hero-active");
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="hero-cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="hero-cursor-dot" aria-hidden="true" />
      <div ref={glowRef} className="hero-cursor-glow" aria-hidden="true" />
    </>
  );
}
