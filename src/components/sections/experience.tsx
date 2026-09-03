import { SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion";

// Placeholder timeline entries — structure and design only. Real roles,
// companies and dates are filled via the CMS in later phases. No fabricated
// experience is claimed.
const timeline = [
  {
    period: "—",
    role: "Role Title Placeholder",
    company: "Company Placeholder",
    notes: ["Placeholder responsibility.", "Placeholder achievement."],
  },
  {
    period: "—",
    role: "Role Title Placeholder",
    company: "Company Placeholder",
    notes: ["Placeholder responsibility."],
  },
];

/**
 * Experience — classified vertical timeline. No corporate logos. A 1px
 * vertical line illuminates in Muted Brass on scroll (scroll-rhythm is a
 * Phase 3 concern; the rail is structural here).
 */
export function Experience() {
  return (
    <section id="experience" className="scroll-mt-24 py-[96px] max-md:py-[64px]">
      <Container>
      <Reveal>
        <SectionHeading index="04" eyebrow="Career" title="Experience" />
      </Reveal>

      <div className="mt-16 border-l border-line pl-4 sm:pl-8 md:ml-8">
        {timeline.map((role, i) => (
          <Reveal key={i} delay={i * 0.15}>
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
