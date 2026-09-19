"use client";

import { useEffect, useRef } from "react";

/**
 * SiteCursor — custom gold ring cursor that follows the mouse across the entire page.
 * Desktop only, disabled on touch/reduced-motion.
 * Uses requestAnimationFrame for smooth following with lerp easing.
 */
export function SiteCursor() {
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

    const ring = ringRef.current;
    const dot = dotRef.current;
    const glow = glowRef.current;
    if (!ring || !dot || !glow) return;

    let raf: number;

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const tick = () => {
      const lerp = 0.12;
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

    document.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="site-cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="site-cursor-dot" aria-hidden="true" />
      <div ref={glowRef} className="site-cursor-glow" aria-hidden="true" />
    </>
  );
}
