import { SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion";

// Placeholder projects (PRD §57). Replaceable via the CMS in later phases.
// No fabricated metrics or achievements are claimed.
const projects = [
  {
    number: "01",
    title: "SIEM Detection & Investigation Lab",
    category: "SOC / Blue Team",
    tech: ["Splunk", "Sysmon", "Windows"],
    status: "Draft",
    description: "Placeholder — detection engineering and investigation practice environment.",
  },
  {
    number: "02",
    title: "Network Traffic Analysis",
    category: "Network Security",
    tech: ["Wireshark", "tcpdump"],
    status: "Draft",
    description: "Placeholder — protocol and packet-level analysis workflow.",
  },
  {
    number: "03",
    title: "Cloud Security Assessment",
    category: "Cloud",
    tech: ["Azure", "IAM"],
    status: "Draft",
    description: "Placeholder — identity and access configuration review.",
  },
];

/**
 * Projects — asymmetric 2-column layout with staggered, tactile editorial
 * cards over the dark 3D backdrop. Physical tilt-on-hover is a Phase 3 concern.
 */
export function Projects() {
  return (
    <section id="projects" className="scroll-mt-24 py-[96px] max-md:py-[64px]">
      <Container>
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading index="03" eyebrow="Selected Work" title="Projects" />
          <Tag tone="accent">Placeholders</Tag>
        </div>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.number} delay={i * 0.1}>
            <article
              className={
                "group flex flex-col justify-between rounded-md border border-line bg-surface/40 p-6 sm:p-8 transition-colors duration-200 hover:border-accent/50 " +
                (i % 2 === 1 ? "md:mt-16" : "")
              }
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-sm tracking-tight text-accent">
                  {project.number}
                </span>
                <Tag>{project.status}</Tag>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:mt-12 sm:gap-4">
                <h3 className="font-display text-[clamp(1.375rem,2.5vw,2.25rem)] font-medium leading-tight tracking-[-0.01em] text-foreground">
                  {project.title}
                </h3>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
                  {project.category}
                </p>
                <p className="max-w-md text-sm leading-relaxed text-foreground/70">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </div>

              <div className="mt-6 sm:mt-8">
                <Button href="#contact" variant="ghost" size="sm">
                  Explore Case Study
                </Button>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      </Container>
    </section>
  );
}
