"use client";

import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion";

// Placeholder grouped technical systems (no fabricated proficiency claims).
// Groups float off-axis and are connected by 1px CSS/SVG hairlines on desktop.
const groups: Array<{ label: string; nodes: string[]; x: number; y: number }> =
  [
    {
      label: "Security",
      x: 8,
      y: 6,
      nodes: ["SOC", "Detection", "Incident Response"],
    },
    {
      label: "Network",
      x: 38,
      y: 34,
      nodes: ["Traffic Analysis", "Protocol Analysis", "Switching"],
    },
    {
      label: "Cloud",
      x: 66,
      y: 8,
      nodes: ["Azure", "IAM", "Logging"],
    },
    {
      label: "Automation",
      x: 74,
      y: 58,
      nodes: ["Python", "Bash", "Scripting"],
    },
  ];

type Edge = { x1: number; y1: number; x2: number; y2: number };

function SkillGroupCard({ group }: { group: (typeof groups)[number] }) {
  return (
    <div className="rounded-md border border-line bg-surface/40 p-4">
      <p className="mb-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-accent">
        {group.label}
      </p>
      <ul className="flex flex-col gap-1.5">
        {group.nodes.map((node) => (
          <li
            key={node}
            className="font-sans text-sm text-foreground/85"
          >
            {node}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Draw 1px hairlines between the central nodes of each group panel (desktop only).
  useEffect(() => {
    if (isMobile) return;
    const el = ref.current;
    if (!el) return;

    const compute = () => {
      const nodeEls = Array.from(
        el.querySelectorAll<HTMLElement>("[data-skill-node]"),
      );
      const centers = nodeEls
        .slice(0, groups.length)
        .map((n) => ({
          x: n.offsetLeft + n.offsetWidth / 2,
          y: n.offsetTop + n.offsetHeight / 2,
        }));

      const nextEdges: Edge[] = [];
      for (let i = 0; i < centers.length; i++) {
        for (let j = i + 1; j < centers.length; j++) {
          nextEdges.push({
            x1: centers[i].x,
            y1: centers[i].y,
            x2: centers[j].x,
            y2: centers[j].y,
          });
        }
      }
      if (el.getBoundingClientRect().width > 0) setEdges(nextEdges);
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMobile]);

  return (
    <section id="skills" className="scroll-mt-24 py-[96px] max-md:py-[64px]">
      <Container>
        <Reveal>
          <SectionHeading index="02" eyebrow="Capability" title="Skills" />
        </Reveal>

        {/* Mobile: simple 2x2 grid */}
        {isMobile ? (
          <Reveal delay={0.1}>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {groups.map((group) => (
                <SkillGroupCard key={group.label} group={group} />
              ))}
            </div>
          </Reveal>
        ) : (
          /* Desktop: constellation with SVG hairlines */
          <Reveal delay={0.1}>
            <div
              ref={ref}
              className="relative mt-16 aspect-[2/1] min-h-[420px] w-full overflow-hidden border border-line/50"
            >
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                {edges.map((e, i) => (
                  <line
                    key={i}
                    x1={e.x1}
                    y1={e.y1}
                    x2={e.x2}
                    y2={e.y2}
                    stroke="rgba(234,233,228,0.12)"
                    strokeWidth="1"
                  />
                ))}
              </svg>

              {groups.map((group) => (
                <div
                  key={group.label}
                  data-skill-node
                  className="absolute w-[26%] rounded-md border border-line bg-surface/40 p-4"
                  style={{
                    left: `${group.x}%`,
                    top: `${group.y}%`,
                    transform:
                      "translate(-10%, -10%) rotate(-1deg) skewX(-1deg)",
                  }}
                >
                  <p className="mb-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-accent">
                    {group.label}
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {group.nodes.map((node) => (
                      <li
                        key={node}
                        className="font-sans text-sm text-foreground/85"
                      >
                        {node}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
