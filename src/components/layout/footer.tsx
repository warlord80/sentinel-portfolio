"use client";

import { useEffect, useState, useRef } from "react";
import { Container } from "@/components/layout/container";

/**
 * Footer — clipped massive typography at the viewport bottom with monospace
 * metadata (copyright, current local time with flip digits, location).
 */
function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

/** Single digit with flip animation on change */
function FlipDigit({ char }: { char: string }) {
  const prevRef = useRef(char);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (prevRef.current !== char) {
      setFlipping(true);
      const t = setTimeout(() => setFlipping(false), 300);
      prevRef.current = char;
      return () => clearTimeout(t);
    }
  }, [char]);

  if (char === ":") {
    return <span className="inline-block w-[0.3em] text-center text-accent/50">:</span>;
  }

  return (
    <span className="flip-digit relative inline-block overflow-hidden" aria-hidden="true">
      <span
        className={
          "inline-block transition-transform duration-300 ease-out" +
          (flipping ? " -translate-y-full opacity-0" : " translate-y-0 opacity-100")
        }
      >
        {char}
      </span>
    </span>
  );
}

export function Footer() {
  const [time, setTime] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTime(formatTime(new Date()));
    const id = setInterval(() => setTime(formatTime(new Date())), 1000);
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
          <span className="inline-flex items-center gap-0.5">
            {time ? (
              <>
                {time.split("").map((char, i) => (
                  <FlipDigit key={`${i}-${char}`} char={char} />
                ))}
                <span className="ml-1 text-accent/50">WAT</span>
              </>
            ) : (
              "—"
            )}
          </span>
        </div>
      </Container>
    </footer>
  );
}
