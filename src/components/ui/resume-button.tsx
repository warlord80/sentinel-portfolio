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
        "rounded-sm border border-line bg-transparent px-5 py-2.5",
        "font-mono text-xs font-medium uppercase tracking-[0.15em] text-muted",
        "transition-all duration-200 ease-out",
        "min-h-[44px]",
        "hover:border-accent/50 hover:text-accent hover:-translate-y-0.5",
        "active:translate-y-0",
        "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-3",
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
