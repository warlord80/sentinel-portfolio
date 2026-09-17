"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { HeroEntrance } from "@/components/motion";
import { GlitchText } from "@/components/ui/glitch-text";
import { ResumeButton } from "@/components/ui/resume-button";
import { useParallax } from "@/components/motion/use-parallax";

/**
 * Hero — asymmetric. The 3D Monolith occupies the mid-ground right via the
 * WebGL EnvironmentLayer (z-1, pointer-events none). This section reserves
 * layout space so the text doesn't overlap the monolith's visual position.
 * The monolith is NOT rendered here — it lives in the scene graph.
 *
 * Subtle scroll parallax is applied to decorative elements for depth.
 */
export function Hero({ resumeUrl = "/resume.pdf" }: { resumeUrl?: string }) {
  const spacerRef = useRef<HTMLDivElement>(null);

  useParallax(spacerRef, { amount: -60, speed: 0.8 });

  return (
    <section
      id="top"
      className="relative flex min-h-[85svh] items-center overflow-hidden max-md:min-h-[80svh]"
    >
      <Container className="grid grid-cols-1 items-center gap-8 pt-20 pb-8 md:grid-cols-12 md:gap-12 md:pt-24">
        <HeroEntrance className="flex flex-col items-start gap-4 md:col-span-7 md:col-start-2 md:gap-6">
          <h1 className="font-display text-[clamp(2.25rem,7vw,5.5rem)] font-medium leading-[1.0] tracking-[-0.02em] text-foreground sm:text-[clamp(2.5rem,6vw,5.5rem)]">
            Chibuike
            <br />
            Nwozor
            <span className="text-accent">.</span>
          </h1>

          <GlitchText />

          <p className="max-w-md font-sans text-[0.95rem] leading-relaxed text-muted sm:text-lg">
            I build, investigate and document practical security systems —
            detection, monitoring and defensive operations.
          </p>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button href="#projects" className="w-full sm:w-auto">
              Explore Work
            </Button>
            <Button href="#contact" variant="secondary" className="w-full sm:w-auto">
              Contact
            </Button>
          </div>
          <ResumeButton href={resumeUrl} className="w-full sm:w-auto" />
        </HeroEntrance>

        {/* Monolith layout spacer — reserves column space so the text
            doesn't overlap the WebGL monolith rendered in EnvironmentLayer.
            Invisible; the 3D monolith renders behind at z-[-1].
            Has subtle scroll parallax for depth. */}
        <div
          ref={spacerRef}
          className="relative hidden md:col-span-4 md:block"
          aria-hidden="true"
        >
          <div className="mx-auto h-[420px] w-[300px]" />
        </div>
      </Container>
    </section>
  );
}
