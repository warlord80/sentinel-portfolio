"use client";

import { cn } from "@/lib/cn";

/**
 * ResumeButton — clean download CV button with subtle pulsating glow
 * and smooth hover elevation.
 */
export function ResumeButton({ href = "/resume.pdf", className }: { href?: string; className?: string }) {
  return (
    <a
      href={href}
      download
      className={cn(
        "group relative inline-flex items-center justify-center gap-2",
        "rounded-sm border border-accent/40 bg-surface px-5 py-2.5",
        "font-mono text-xs font-medium uppercase tracking-[0.15em] text-accent",
        "transition-all duration-300 ease-out",
        "hover:border-accent hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(197,160,89,0.2)]",
        "active:translate-y-0 active:scale-[0.98]",
        "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-3",
        "resume-glow",
        className,
      )}
      aria-label="Download CV"
    >
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
