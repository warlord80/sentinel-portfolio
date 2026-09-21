import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion";
import type { Writeup } from "@/lib/types";

const fallback: Writeup[] = [
  { id: "w1", title: "Writeup Title Placeholder — Detection Engineering Notes", date: "—", read: "— min", slug: "detection-engineering-notes", order: 0, created_at: "", updated_at: "" },
  { id: "w2", title: "Writeup Title Placeholder — Incident Response Notes", date: "—", read: "— min", slug: "incident-response-notes", order: 1, created_at: "", updated_at: "" },
  { id: "w3", title: "Writeup Title Placeholder — Networking Fundamentals", date: "—", read: "— min", slug: "networking-fundamentals", order: 2, created_at: "", updated_at: "" },
];

export function Writeups({ initialWriteups = [] }: { initialWriteups?: Writeup[] }) {
  const writeups = initialWriteups.length > 0 ? initialWriteups : fallback;

  return (
    <section id="writeups" className="scroll-mt-24 py-[96px] max-md:py-[64px]">
      <Container>
        <Reveal>
          <SectionHeading index="06" eyebrow="Journal" title="Writeups" />
        </Reveal>

        <ul className="mt-10 flex flex-col border-t border-line">
        {writeups.map((writeup, i) => (
          <Reveal key={writeup.id} delay={i * 0.1}>
            <li
              className="group flex flex-col gap-2 border-b border-line py-5 transition-colors"
            >
              <div className="flex items-center justify-between gap-4 font-mono text-xs uppercase tracking-[0.14em] text-muted">
                <span>{writeup.date}</span>
                <span className="opacity-60">{writeup.read}</span>
              </div>
              <Link
                href={`/writeups/${writeup.slug}`}
                className="block"
              >
                <h3 className="font-display text-[clamp(1.25rem,4vw,3rem)] font-medium leading-tight tracking-[-0.01em] text-foreground/80 transition-colors duration-200 group-hover:text-accent sm:text-[clamp(1.5rem,4vw,3rem)]">
                  {writeup.title}
                </h3>
              </Link>
            </li>
          </Reveal>
        ))}
      </ul>
      </Container>
    </section>
  );
}
