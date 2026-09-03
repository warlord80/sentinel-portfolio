"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/cn";

/**
 * ResumeButton — download CV with animated scan line, border glow, and click flash.
 *
 * - Animated brass border traces around the button
 * - Scan line sweeps across periodically
 * - Click triggers a bright flash
 */
export function ResumeButton({ className }: { className?: string }) {
  const [isPulsing, setIsPulsing] = useState(false);

  const handleClick = useCallback(() => {
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 700);
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
        "transition-all duration-300",
        "hover:border-accent hover:bg-accent/5 hover:shadow-[0_0_20px_rgba(197,160,89,0.2)]",
        "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-3",
        isPulsing && "resume-btn-flash",
        className,
      )}
    >
      {/* Scan line — sweeps across periodically */}
      <span className="resume-scan-line pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span className="absolute inset-y-0 left-0 w-full -translate-x-full bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      </span>

      {/* Border trace animation */}
      <span className="resume-border-trace pointer-events-none absolute inset-0 rounded-sm" aria-hidden="true" />

      {/* Content */}
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
      <span className="relative">Download CV</span>
    </a>
  );
}
