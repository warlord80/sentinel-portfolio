import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion";
import type { Certification } from "@/lib/types";

const fallback: Certification[] = [
  { id: "c1", initial: "S", name: "CompTIA Security+", issuer: "CompTIA", order: 0, created_at: "", updated_at: "" },
  { id: "c2", initial: "C", name: "Cisco CyberOps Associate", issuer: "Cisco", order: 1, created_at: "", updated_at: "" },
];

export function Certifications({ initialCertifications = [] }: { initialCertifications?: Certification[] }) {
  const certs = initialCertifications.length > 0 ? initialCertifications : fallback;

  return (
    <section id="certifications" className="scroll-mt-24 py-[96px] max-md:py-[64px] section-alt border-t border-b border-line/50">
      <Container>
      <Reveal>
        <SectionHeading index="05" eyebrow="Credentials" title="Certifications" />
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5">
        {certs.map((cert, i) => (
          <Reveal key={cert.id} delay={i * 0.1}>
            {cert.url ? (
              <Link
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <CertCard cert={cert} />
              </Link>
            ) : (
              <CertCard cert={cert} />
            )}
          </Reveal>
        ))}
      </div>
      </Container>
    </section>
  );
}

function CertCard({ cert }: { cert: Certification }) {
  return (
    <article className="group relative flex items-start gap-5 rounded-md border border-line bg-surface/40 p-6 transition-all duration-220 hover:border-accent/50 hover:bg-surface/60">
      {/* Badge */}
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-accent/30 bg-accent/5 font-display text-xl font-medium text-accent transition-colors group-hover:border-accent/60 group-hover:bg-accent/10">
        {cert.initial}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-base font-medium leading-snug text-foreground sm:text-lg">
          {cert.name}
        </h3>
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">
          {cert.issuer}
        </p>
        {cert.url && (
          <span className="font-mono text-xs text-accent opacity-0 transition-opacity group-hover:opacity-100">
            Verify ↗
          </span>
        )}
      </div>

      {/* Hover glow */}
      <div className="pointer-events-none absolute inset-0 rounded-md bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
    </article>
  );
}
