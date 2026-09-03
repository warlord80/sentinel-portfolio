"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/cn";

/**
 * ResumeButton — download CV with animated scan line, border glow, and click flash.
 *
 * - Idle: stable, no unnecessary movement
 * - Hover: subtle elevation, glow, slight upward translation
 * - Press: small scale compression (via CSS :active)
 * - Download: brief checkmark confirmation state
 */
export function ResumeButton({ className }: { className?: string }) {
  const [isPulsing, setIsPulsing] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleClick = useCallback(() => {
    setIsPulsing(true);
    setTimeout(() => {
      setIsPulsing(false);
      setIsDownloaded(true);
    }, 700);
    setTimeout(() => setIsDownloaded(false), 2500);
  }, []);

  return (
    <a
      href="/resume.pdf"
      download
      onClick={handleClick}
      className={cn(
        "resume-btn group relative inline-flex items-center justify-center gap-2",
        "overflow-hidden rounded-sm border border-accent/40 bg-surface px-5 py-2.5",
        "font-mono text-xs font-medium uppercase tracking-[0.15em] text-accent",
        "transition-all duration-300 ease-out",
        "hover:border-accent hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(197,160,89,0.15)]",
        "active:translate-y-0 active:scale-[0.98] active:shadow-none",
        "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-3",
        isPulsing && "resume-btn-flash",
        className,
      )}
      aria-label={isDownloaded ? "CV downloaded" : "Download CV"}
    >
      {/* Scan line — sweeps across periodically */}
      <span className="resume-scan-line pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span className="absolute inset-y-0 left-0 w-full -translate-x-full bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      </span>

      {/* Border trace animation */}
      <span className="resume-border-trace pointer-events-none absolute inset-0 rounded-sm" aria-hidden="true" />

      {/* Content */}
      {isDownloaded ? (
        <svg
          className="relative h-4 w-4 transition-transform duration-300"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 8.5l3.5 3.5 6.5-7" />
        </svg>
      ) : (
        <svg
          className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M8 2v9M4.5 8.5L8 12l3.5-3.5M3 14h10" />
        </svg>
      )}
      <span className="relative">{isDownloaded ? "Downloaded" : "Download CV"}</span>
    </a>
  );
}
