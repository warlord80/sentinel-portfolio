import { SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion";

// Placeholder certifications — geometric badge tiles only. No certification
// is claimed as held; entries are filled via the CMS later.
const certs = [
  { initial: "A", name: "Certificate Placeholder", issuer: "Issuer" },
  { initial: "B", name: "Certificate Placeholder", issuer: "Issuer" },
  { initial: "C", name: "Certificate Placeholder", issuer: "Issuer" },
  { initial: "D", name: "Certificate Placeholder", issuer: "Issuer" },
];

/**
 * Certifications — minimalist horizontal track of geometric badges.
 * Hover/tap reveal is a later-phase interaction.
 */
export function Certifications() {
  return (
    <section id="certifications" className="scroll-mt-24 py-[96px] max-md:py-[64px]">
      <Container>
      <Reveal>
        <SectionHeading index="05" eyebrow="Credentials" title="Certifications" />
      </Reveal>

      <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
        {certs.map((cert, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <article
              className="group flex flex-col items-start gap-4 rounded-md border border-line bg-surface/40 p-6 transition-colors duration-200 hover:border-accent/50"
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-md border border-accent/40 font-display text-lg font-medium text-accent"
                aria-hidden="true"
              >
                {cert.initial}
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-sans text-sm font-medium leading-snug text-foreground">
                  {cert.name}
                </h3>
                <Tag>{cert.issuer}</Tag>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      </Container>
    </section>
  );
}
