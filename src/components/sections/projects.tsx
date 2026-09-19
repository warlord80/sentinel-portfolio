"use client";

import Image from "next/image";
import { useCallback } from "react";
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
    image: "",
  },
  {
    number: "02",
    title: "Network Traffic Analysis",
    category: "Network Security",
    tech: ["Wireshark", "tcpdump"],
    status: "Draft",
    description: "Placeholder — protocol and packet-level analysis workflow.",
    image: "",
  },
  {
    number: "03",
    title: "Cloud Security Assessment",
    category: "Cloud",
    tech: ["Azure", "IAM"],
    status: "Draft",
    description: "Placeholder — identity and access configuration review.",
    image: "",
  },
];

/**
 * Projects — asymmetric 2-column layout with staggered, tactile editorial
 * cards over the dark 3D backdrop. Physical tilt-on-hover is a Phase 3 concern.
 */
export function Projects() {
  const onPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--x", `${x}%`);
    e.currentTarget.style.setProperty("--y", `${y}%`);
  }, []);

  return (
    <section id="projects" className="scroll-mt-24 py-[96px] max-md:py-[64px]">
      <Container>
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading index="03" eyebrow="Selected Work" title="Projects" />
          <Tag tone="accent">Placeholders</Tag>
        </div>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.number} delay={i * 0.1}>
            <article
              onPointerMove={onPointerMove}
              className={
                "card-spotlight card-beam group flex flex-col justify-between rounded-md border border-line bg-surface/40 transition-all duration-220 hover:border-accent/50 " +
                (i % 2 === 1 ? "md:mt-12" : "")
              }
            >
              {project.image && (
                <div className="overflow-hidden border-b border-line">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={800}
                    height={224}
                    className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-44"
                  />
                </div>
              )}
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs tracking-tight text-accent">
                    {project.number}
                  </span>
                  <Tag>{project.status}</Tag>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <h3 className="font-display text-base font-medium leading-tight tracking-[-0.01em] text-foreground sm:text-lg">
                    {project.title}
                  </h3>
                  <p className="max-w-md text-sm leading-relaxed text-foreground/70">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <Button href="#contact" variant="ghost" size="sm">
                    Explore Case Study
                  </Button>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      </Container>
    </section>
  );
}
