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
    const nextIndex = (currentIndex.current + 1) % ROLES.length;
    const nextText = ROLES[nextIndex];
    const nextChars = nextText.split("");

    // Rebuild DOM to match new text length
    container.innerHTML = "";
    nextChars.forEach((ch) => {
      const span = document.createElement("span");
      span.setAttribute("data-char", "");
      span.textContent = ch === " " ? "\u00A0" : ch;
      span.style.display = "inline-block";
      span.style.willChange = "transform, opacity";
      container.appendChild(span);
    });

    const chars = container.querySelectorAll<HTMLElement>("[data-char]");
    if (chars.length === 0) {
      isAnimating.current = false;
      currentIndex.current = nextIndex;
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        currentIndex.current = nextIndex;
        isAnimating.current = false;
      },
    });

    const outDur = 0.25;
    const glitchDur = 0.4;
    const scatterDur = 0.2;
    const rebuildDur = 0.4;

    // ── Phase 1: Out — quick fade up ───────────────────────────────
    chars.forEach((char, i) => {
      tl.to(
        char,
        { y: -16, opacity: 0, duration: outDur, ease: "power2.in" },
        (i / chars.length) * outDur * 0.3,
      );
    });

    // ── Phase 2: Glitch — brief scramble ───────────────────────────
    const glitchStart = outDur + 0.04;

    chars.forEach((char, i) => {
      const d = glitchStart + (i / chars.length) * glitchDur * 0.3;
      const reps = getRandomInt(2, 3);

      tl.set(char, { y: 0, scale: 1 }, d);

      tl.to(
        char,
        {
          duration: glitchDur / reps,
          repeat: reps,
          onRepeat: () => { char.textContent = getRandomChar(); },
          color: () => {
            const c = ["#C99A4A", "#4a9eff", "#F3F1EB"];
            return c[Math.floor(Math.random() * c.length)];
          },
          onComplete: () => { char.textContent = getRandomChar(); },
        },
        d,
      );
    });

    // ── Phase 3: Scatter — gentle drift away (reduced intensity) ───
    const scatterStart = glitchStart + glitchDur * 0.5;

    chars.forEach((char, i) => {
      tl.to(
        char,
        {
          x: (Math.random() - 0.5) * 60,
          y: getRandomInt(20, 50),
          rotation: (Math.random() - 0.5) * 20,
          scale: 0.5 + Math.random() * 0.2,
          opacity: 0,
          duration: scatterDur,
          ease: "power2.in",
        },
        scatterStart + (i / chars.length) * 0.05,
      );
    });

    // ── Phase 4: Rebuild — quick clean resolve ─────────────────────
    const rebuildStart = scatterStart + scatterDur + 0.06;
    const dataChars = "01█";

    chars.forEach((char, i) => {
      const cd = rebuildStart + (i / chars.length) * rebuildDur * 0.25;
      const preReveal = getRandomInt(1, 2);

      gsap.set(char, {
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.5) * 30 - 10,
        rotation: (Math.random() - 0.5) * 15,
        scale: 0.5 + Math.random() * 0.2,
        opacity: 0,
        color: "#4a9eff",
      });

      tl.to(char, { opacity: 1, duration: 0.04 }, cd);

      for (let j = 0; j < preReveal; j++) {
        tl.call(
          () => { char.textContent = dataChars[Math.floor(Math.random() * dataChars.length)]; },
          undefined,
          cd + j * 0.02,
        );
      }

      tl.call(
        () => { char.textContent = nextChars[i] === " " ? "\u00A0" : nextChars[i]; },
        undefined,
        cd + preReveal * 0.02,
      );

      tl.to(
        char,
        { x: 0, y: 0, rotation: 0, scale: 1, duration: rebuildDur * 0.4, ease: "back.out(1.2)" },
        cd,
      );

      tl.to(
        char,
        { color: "#AAA7A0", duration: 0.2, ease: "power2.out" },
        cd + rebuildDur * 0.3,
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
      className="relative h-[1.4em] w-full overflow-hidden font-mono text-[0.8em] tracking-[0.15em] text-muted sm:text-[0.85em]"
      aria-label={ROLES[0]}
      aria-hidden="true"
    />
  );
}
