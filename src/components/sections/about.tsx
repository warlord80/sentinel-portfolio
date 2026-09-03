import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion";

/**
 * About / intro — editorial text block aligned left within the 12-column
 * grid. Sentinel glides into the deep background (WebGL, later phase).
 */
export function About() {
  return (
    <section id="about" className="scroll-mt-24 py-[96px] max-md:py-[64px]">
      <Container>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-12">
        <div className="sm:col-span-12 md:col-span-7">
          <Reveal>
            <SectionHeading index="01" eyebrow="Profile" title="About" />
          </Reveal>
          <Reveal delay={0.1} className="prose-max mt-8 flex flex-col gap-5 font-sans text-base leading-[1.7] text-foreground/85">
            <p>
              A cybersecurity analyst focused on SOC operations, security
              monitoring and incident investigation. This portfolio documents
              the practical systems, labs and writeups that shape a
              detection-first defensive approach.
            </p>
            <p className="text-muted">
              Working across network security, detection engineering and
              incident response, with an emphasis on building repeatable,
              well-documented investigations rather than novelty tooling.
            </p>
          </Reveal>
        </div>
        <div className="sm:col-span-12 md:col-span-4 md:col-start-9">
          <Reveal delay={0.2}>
            <dl className="flex flex-col gap-4 border-l border-line pl-6">
              <div className="flex flex-col gap-1">
                <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  Focus
                </dt>
                <dd className="font-sans text-sm text-foreground">
                  SOC · Detection · IR
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  Base
                </dt>
                <dd className="font-sans text-sm text-foreground">Nigeria</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  Status
                </dt>
                <dd className="font-sans text-sm text-foreground">
                  <span className="available-status relative inline-flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                    </span>
                    Available
                  </span>
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
        </div>
      </Container>
    </section>
  );
}
