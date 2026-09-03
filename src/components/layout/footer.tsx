"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/layout/container";

/**
 * Footer — clipped massive typography at the viewport bottom with monospace
 * metadata (copyright, current local time, location).
 */
function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function Footer() {
  const [time, setTime] = useState<string>("");

  // A timezone clock is an external system that must initialize after mount
  // to stay hydration-safe. The blanket concern about cascading app-state
  // renders does not apply to this idempotent time string, so the rule is
  // suppressed for this specific statement only.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTime(formatTime(new Date()));
    const id = setInterval(() => setTime(formatTime(new Date())), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-line">
      <Container className="pb-10 pt-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          © {new Date().getFullYear()} Chibuike Nwozor
        </p>

        {/* Clipped massive typography */}
        <div
          aria-hidden="true"
          className="select-none overflow-hidden font-display text-[clamp(4rem,18vw,16rem)] font-medium leading-[0.85] tracking-[-0.04em] text-foreground/5"
        >
          NWOZOR
        </div>

        <div className="mt-6 flex flex-wrap justify-between gap-4 font-mono text-xs uppercase tracking-[0.14em] text-muted">
          <span>Cluster / Lagos, NG</span>
          <span>{time ? `${time} WAT` : "—"}</span>
        </div>
      </Container>
    </footer>
  );
}
