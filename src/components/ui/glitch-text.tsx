"use client";

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";

const ROLES = [
  "CYBERSECURITY ANALYST",
  "THREAT DETECTION SPECIALIST",
  "SECURITY ENGINEER",
  "SOC ANALYST",
  "CLOUD SECURITY",
];

const GLITCH_CHARS = "0123456789ABCDEFabcdef█▓▒░╬╫╪┼";

function getRandomChar() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * GlitchText — cybersecurity-themed role text animation.
 *
 * 1. Hold — text displays clearly
 * 2. Out — characters lift and fade (exit)
 * 3. Glitch — scramble to random hex/binary data
 * 4. Scatter — fragments fall like corrupted data
 * 5. Rebuild — new role assembles from data streams
 * 6. Settle — characters become sharp and readable
 */
export function GlitchText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentIndex = useRef(0);
  const isAnimating = useRef(false);
  const prefersReduced = useRef(false);

  const animateTransition = useCallback(() => {
    if (isAnimating.current || !containerRef.current || prefersReduced.current) return;
    isAnimating.current = true;

    const container = containerRef.current;
    const chars = container.querySelectorAll<HTMLElement>("[data-char]");
    if (chars.length === 0) {
      isAnimating.current = false;
      return;
    }

    const nextIndex = (currentIndex.current + 1) % ROLES.length;
    const nextText = ROLES[nextIndex];
    const tl = gsap.timeline({
      onComplete: () => {
        currentIndex.current = nextIndex;
        isAnimating.current = false;
      },
    });

    const outDur = 0.3;
    const glitchDur = 0.55;
    const scatterDur = 0.3;
    const rebuildDur = 0.5;

    // ── Phase 1: Out — lift and fade ───────────────────────────────
    chars.forEach((char, i) => {
      tl.to(
        char,
        { y: -22, opacity: 0, scale: 0.9, duration: outDur, ease: "power2.in" },
        (i / chars.length) * outDur * 0.35,
      );
    });

    // ── Phase 2: Glitch — scramble to data ─────────────────────────
    const glitchStart = outDur + 0.06;

    chars.forEach((char, i) => {
      const d = glitchStart + (i / chars.length) * glitchDur * 0.35;
      const reps = getRandomInt(3, 5);

      tl.set(char, { y: 0, scale: 1 }, d);

      tl.to(
        char,
        {
          duration: glitchDur / reps,
          repeat: reps,
          onRepeat: () => { char.textContent = getRandomChar(); },
          color: () => {
            const c = ["#c5a059", "#4a9eff", "#ff4a4a", "#00ff88", "#eae9e4"];
            return c[Math.floor(Math.random() * c.length)];
          },
          onComplete: () => { char.textContent = getRandomChar(); },
        },
        d,
      );
    });

    // ── Phase 3: Scatter — fall away ───────────────────────────────
    const scatterStart = glitchStart + glitchDur * 0.55;

    chars.forEach((char, i) => {
      tl.to(
        char,
        {
          x: (Math.random() - 0.5) * 180,
          y: getRandomInt(50, 150),
          rotation: (Math.random() - 0.5) * 80,
          scale: 0.1 + Math.random() * 0.25,
          opacity: 0,
          duration: scatterDur,
          ease: "power3.in",
        },
        scatterStart + (i / chars.length) * 0.07,
      );
    });

    // ── Phase 4: Rebuild — assemble from data streams ──────────────
    const rebuildStart = scatterStart + scatterDur + 0.1;

    chars.forEach((char, i) => {
      if (i < nextText.length) {
        char.textContent = nextText[i] === " " ? "\u00A0" : nextText[i];
      } else {
        char.textContent = "";
      }
      gsap.set(char, {
        x: (Math.random() - 0.5) * 160,
        y: (Math.random() - 0.5) * 100 - 30,
        rotation: (Math.random() - 0.5) * 50,
        scale: 0.3 + Math.random() * 0.3,
        opacity: 0,
        color: "#4a9eff",
      });
    });

    const finalChars = container.querySelectorAll<HTMLElement>("[data-char]");
    const dataChars = "01█▓░";

    finalChars.forEach((char, i) => {
      if (i >= nextText.length) return;

      const cd = rebuildStart + (i / nextText.length) * rebuildDur * 0.3;
      const preReveal = getRandomInt(2, 3);

      tl.to(char, { opacity: 1, duration: 0.04 }, cd);

      for (let j = 0; j < preReveal; j++) {
        tl.call(
          () => { char.textContent = dataChars[Math.floor(Math.random() * dataChars.length)]; },
          undefined,
          cd + j * 0.03,
        );
      }

      tl.call(
        () => { char.textContent = nextText[i] === " " ? "\u00A0" : nextText[i]; },
        undefined,
        cd + preReveal * 0.03,
      );

      tl.to(
        char,
        { x: 0, y: 0, rotation: 0, scale: 1, duration: rebuildDur * 0.5, ease: "back.out(1.4)" },
        cd,
      );

      tl.to(
        char,
        { color: "#8c8f99", duration: 0.25, ease: "power2.out" },
        cd + rebuildDur * 0.35,
      );
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    prefersReduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const text = ROLES[0];
    containerRef.current.innerHTML = "";
    for (let i = 0; i < text.length; i++) {
      const span = document.createElement("span");
      span.setAttribute("data-char", "");
      span.textContent = text[i] === " " ? "\u00A0" : text[i];
      span.style.display = "inline-block";
      span.style.willChange = "transform, opacity";
      containerRef.current.appendChild(span);
    }

    if (prefersReduced.current) return;

    const interval = setInterval(animateTransition, 3800);
    return () => clearInterval(interval);
  }, [animateTransition]);

  return (
    <div
      ref={containerRef}
      className="h-[1.4em] overflow-hidden font-mono text-[0.85em] tracking-[0.15em] text-muted"
      aria-label={ROLES[0]}
      aria-hidden="true"
    />
  );
}
