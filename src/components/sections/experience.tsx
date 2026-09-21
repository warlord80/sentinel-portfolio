import { SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion";
import type { Experience as ExperienceType } from "@/lib/types";

const fallback: ExperienceType[] = [
  {
    id: "e1",
    period: "—",
    role: "Role Title Placeholder",
    company: "Company Placeholder",
    notes: ["Placeholder responsibility.", "Placeholder achievement."],
    order: 0,
    created_at: "",
    updated_at: "",
  },
];

export function Experience({ initialExperiences = [] }: { initialExperiences?: ExperienceType[] }) {
  const timeline = initialExperiences.length > 0 ? initialExperiences : fallback;

  return (
    <section id="experience" className="scroll-mt-24 py-[96px] max-md:py-[64px] section-alt border-t border-b border-line/50">
      <Container>
      <Reveal>
        <SectionHeading index="04" eyebrow="Career" title="Experience" />
      </Reveal>

      <div className="mt-12 border-l border-line pl-4 sm:mt-16 sm:pl-8 md:ml-8">
        {timeline.map((role, i) => (
          <Reveal key={role.id} delay={i * 0.15}>
            <article
              className="relative pb-12 last:pb-0"
            >
              {/* Timeline node */}
              <span
                className="absolute -left-[33px] top-1.5 hidden h-2 w-2 rounded-full bg-accent sm:block"
                aria-hidden="true"
              />
              <div className="flex flex-col gap-3">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  {role.period}
                </p>
                <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-2">
                  <h3 className="font-display text-xl font-medium tracking-tight text-foreground sm:text-2xl">
                    {role.role}
                  </h3>
                  <Tag>{role.company}</Tag>
                </div>
                <ul className="mt-2 flex flex-col gap-2">
                  {role.notes.map((note, j) => (
                    <li
                      key={j}
                      className="font-sans text-sm leading-relaxed text-muted"
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      </Container>
    </section>
  );
}
