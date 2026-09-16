"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const STORAGE_KEY = "sentinel-preloader-seen";
const COUNT_DURATION = 1.5;

/**
 * Preloader — full-viewport sentinel-themed intro screen.
 * Runs once per session via sessionStorage. Simplified to avoid
 * gsap.context race conditions with React state updates.
 */
export function Preloader() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    return !sessionStorage.getItem(STORAGE_KEY);
  });
  const overlayRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!visible || !overlayRef.current) return;

    document.body.style.overflow = "hidden";
    const overlay = overlayRef.current;
    const counter = counterRef.current;
    let cancelled = false;

    const tl = gsap.timeline({
      onComplete: () => {
        if (cancelled) return;
        sessionStorage.setItem(STORAGE_KEY, "1");
        document.body.style.overflow = "";

        gsap.to(overlay, {
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
          onComplete: () => {
            if (!cancelled) setVisible(false);
          },
        });
      },
    });

    const obj = { val: 0 };
    tl.to(obj, {
      val: 100,
      duration: COUNT_DURATION,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counter && !cancelled) {
          counter.textContent =
            String(Math.round(obj.val)).padStart(2, "0") + "%";
        }
      },
    });

    tl.to({}, { duration: 0.15 });

    tl.to(
      ".preloader-center",
      { opacity: 0, y: -12, duration: 0.3, ease: "power2.in" },
      "-=0.1",
    );
    tl.to(
      ".preloader-footer",
      { opacity: 0, duration: 0.25, ease: "power2.in" },
      "-=0.25",
    );

    return () => {
      cancelled = true;
      tl.kill();
      gsap.killTweensOf(overlay);
      gsap.killTweensOf(".preloader-center");
      gsap.killTweensOf(".preloader-footer");
      document.body.style.overflow = "";
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="pointer-events-auto fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
    >
      {/* Radar pulse rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <span className="preloader-radar preloader-radar-1 absolute h-40 w-40 rounded-full border border-accent/20" />
        <span className="preloader-radar preloader-radar-2 absolute h-40 w-40 rounded-full border border-accent/15" />
        <span className="preloader-radar preloader-radar-3 absolute h-40 w-40 rounded-full border border-accent/10" />
      </div>

      {/* Center mark */}
      <div className="preloader-center relative flex flex-col items-center gap-5">
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
      <div className="preloader-footer absolute inset-x-0 bottom-0 flex items-end justify-between px-6 pb-6 sm:px-10 sm:pb-8">
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
