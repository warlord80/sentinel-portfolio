"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion";
import type { Project } from "@/lib/types";

// Fallback when CMS returns no published projects
const fallback: Project[] = [
  {
    id: "fallback-1",
    number: "01",
    title: "SIEM Detection & Investigation Lab",
    category: "SOC / Blue Team",
    tech: ["Splunk", "Sysmon", "Windows"],
    status: "Draft",
    description: "Placeholder — detection engineering and investigation practice environment.",
    slug: "siem-detection-lab",
    image: "",
    url: "",
    order: 0,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-2",
    number: "02",
    title: "Network Traffic Analysis",
    category: "Network Security",
    tech: ["Wireshark", "tcpdump"],
    status: "Draft",
    description: "Placeholder — protocol and packet-level analysis workflow.",
    slug: "network-traffic-analysis",
    image: "",
    url: "",
    order: 1,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-3",
    number: "03",
    title: "Cloud Security Assessment",
    category: "Cloud",
    tech: ["Azure", "IAM"],
    status: "Draft",
    description: "Placeholder — identity and access configuration review.",
    slug: "cloud-security-assessment",
    image: "",
    url: "",
    order: 2,
    created_at: "",
    updated_at: "",
  },
];

export function Projects({ initialProjects = [] }: { initialProjects?: Project[] }) {
  const projects = initialProjects.length > 0 ? initialProjects : fallback;

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
          {initialProjects.length === 0 && <Tag tone="accent">Placeholders</Tag>}
        </div>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.id} delay={i * 0.1}>
            <article
              onPointerMove={onPointerMove}
              className={
                "card-spotlight card-beam group flex flex-col justify-between rounded-lg border border-line bg-surface/40 transition-all duration-220 hover:border-accent/50 " +
                (i % 2 === 1 ? "md:mt-12" : "")
              }
            >
              {project.image && (
                <Link href={`/projects/${project.slug}`} className="block overflow-hidden border-b border-line">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={800}
                    height={224}
                    className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-44"
                  />
                </Link>
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
                    <Link href={`/projects/${project.slug}`} className="hover:text-accent transition-colors">
                      {project.title}
                    </Link>
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

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-accent transition-colors hover:text-accent/80"
                  >
                    View Case Study →
                  </Link>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-accent"
                    >
                      Live Project ↗
                    </a>
                  )}
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
