"use client";

const TICKER_ITEMS = [
  "CYBERSECURITY",
  "THREAT DETECTION",
  "SOC ANALYSIS",
  "SIEM",
  "NETWORK SECURITY",
  "CLOUD SECURITY",
  "INCIDENT RESPONSE",
  "SECURITY OPERATIONS",
];

const SEPARATOR = (
  <span className="mx-4 inline-block h-1 w-1 rounded-full bg-accent/40" aria-hidden="true" />
);

/**
 * Technical ticker — one continuous, seamless-scrolling horizontal band
 * placed between major sections. Uses CSS keyframe animation for smooth,
 * GPU-friendly playback. Pauses on hover for readability. Content is
 * placeholder text.
 */
export function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div
      className="relative overflow-hidden border-y border-line/50 py-4"
      aria-label="Technical specialties"
      role="region"
    >
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />

      <div className="ticker-scroll flex items-center whitespace-nowrap">
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className="inline-flex items-center">
            {SEPARATOR}
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted/60">
              {item}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
