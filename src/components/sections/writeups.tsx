import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion";

// Placeholder writeups — journal-style list. Replaced via the CMS later.
const writeups = [
  { title: "Writeup Title Placeholder — Detection Engineering Notes", date: "—", read: "— min" },
  { title: "Writeup Title Placeholder — Incident Response Notes", date: "—", read: "— min" },
  { title: "Writeup Title Placeholder — Networking Fundamentals", date: "—", read: "— min" },
];

/**
 * Writeups — clean list mimicking a premium technical journal. Massive
 * title treatment on hover; JetBrains Mono for dates and read times.
 */
export function Writeups() {
  return (
    <section id="writeups" className="scroll-mt-24 py-[96px] max-md:py-[64px]">
      <Container>
        <Reveal>
          <SectionHeading index="06" eyebrow="Journal" title="Writeups" />
        </Reveal>

        <ul className="mt-10 flex flex-col border-t border-line">
        {writeups.map((writeup, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <li
              className="group flex flex-col gap-2 border-b border-line py-8 transition-colors"
            >
              <div className="flex items-center justify-between gap-4 font-mono text-xs uppercase tracking-[0.14em] text-muted">
                <span>{writeup.date}</span>
                <span className="opacity-60">{writeup.read}</span>
              </div>
              <h3 className="font-display text-[clamp(1.5rem,4vw,3rem)] font-medium leading-tight tracking-[-0.01em] text-foreground/80 transition-colors duration-200 group-hover:text-accent">
                {writeup.title}
              </h3>
            </li>
          </Reveal>
        ))}
      </ul>
      </Container>
    </section>
  );
}
