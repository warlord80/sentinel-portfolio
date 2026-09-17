"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "sentinel-preloader-seen";
const COUNT_MS = 1500;
const HOLD_MS = 150;
const EXIT_MS = 400;

/**
 * Preloader — full-viewport sentinel-themed intro screen.
 * Uses requestAnimationFrame for the counter (no GSAP dependency)
 * and CSS transitions for the exit. Avoids all GSAP/React lifecycle conflicts.
 */
export function Preloader() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    return !sessionStorage.getItem(STORAGE_KEY);
  });
  const [exiting, setExiting] = useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!visible) return;

    document.body.style.overflow = "hidden";
    let raf: number;
    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now;
      const elapsed = now - start;
      const progress = Math.min(elapsed / COUNT_MS, 1);
      const pct = Math.round(progress * 100);

      if (counterRef.current) {
        counterRef.current.textContent = String(pct).padStart(2, "0") + "%";
      }

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // Count finished — hold briefly then exit
        setTimeout(() => {
          sessionStorage.setItem(STORAGE_KEY, "1");
          setExiting(true);

          setTimeout(() => {
            document.body.style.overflow = "";
            setVisible(false);
          }, EXIT_MS);
        }, HOLD_MS);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`pointer-events-auto fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ease-in ${exiting ? "opacity-0" : "opacity-100"}`}
    >
      {/* Radar pulse rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <span className="preloader-radar preloader-radar-1 absolute h-40 w-40 rounded-full border border-accent/20" />
        <span className="preloader-radar preloader-radar-2 absolute h-40 w-40 rounded-full border border-accent/15" />
        <span className="preloader-radar preloader-radar-3 absolute h-40 w-40 rounded-full border border-accent/10" />
      </div>

      {/* Center mark */}
      <div className={`preloader-center relative flex flex-col items-center gap-5 transition-all duration-300 ease-in ${exiting ? "-translate-y-3 opacity-0" : "translate-y-0 opacity-100"}`}>
        <div className="font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          NWOZOR<span className="text-accent">.</span>
        </div>
        <div className="flex items-center gap-2 rounded-sm border border-line bg-surface/50 px-3 py-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted">
            SENTINEL_ONLINE
          </span>
        </div>
      </div>

      {/* Bottom readouts */}
      <div className={`preloader-footer absolute inset-x-0 bottom-0 flex items-end justify-between px-6 pb-6 transition-opacity duration-300 ease-in sm:px-10 sm:pb-8 ${exiting ? "opacity-0" : "opacity-100"}`}>
        <div className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted/60 max-sm:hidden">
          <div>SYS.08 // SEC_INITIALIZED</div>
          <div className="mt-0.5">BUILD_0719 // {new Date().getFullYear()}</div>
        </div>
        <span
          ref={counterRef}
          className="font-mono text-3xl font-light tracking-[0.08em] text-foreground/80 sm:text-4xl"
        >
          00%
        </span>
      </div>
    </div>
  );
}
