import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { HeroEntrance } from "@/components/motion";
import { GlitchText } from "@/components/ui/glitch-text";
import { ResumeButton } from "@/components/ui/resume-button";

/**
 * Hero — asymmetric. The 3D Monolith occupies the mid-ground right via the
 * WebGL EnvironmentLayer (z-1, pointer-events none). This section reserves
 * layout space so the text doesn't overlap the monolith's visual position.
 * The monolith is NOT rendered here — it lives in the scene graph.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      <Container className="grid grid-cols-1 items-center gap-12 pt-16 md:grid-cols-12">
        <HeroEntrance className="flex flex-col items-start gap-8 md:col-span-7 md:col-start-2">
          <GlitchText />

          <h1 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-medium leading-[1.0] tracking-[-0.02em] text-foreground">
            Chibuike
            <br />
            Nwozor
            <span className="text-accent">.</span>
          </h1>

          <p className="max-w-md font-sans text-lg text-muted">
            I build, investigate and document practical security systems —
            detection, monitoring and defensive operations.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button href="#projects">
              Explore Work
            </Button>
            <Button href="#contact" variant="secondary">
              Contact
            </Button>
            <ResumeButton />
          </div>
        </HeroEntrance>

        {/* Monolith layout spacer — reserves column space so the text
            doesn't overlap the WebGL monolith rendered in EnvironmentLayer.
            Invisible; the 3D monolith renders behind at z-[-1]. */}
        <div
          className="relative hidden md:col-span-4 md:block"
          aria-hidden="true"
        >
          <div className="mx-auto h-[420px] w-[300px]" />
        </div>
      </Container>
    </section>
  );
}
