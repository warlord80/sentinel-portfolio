import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { site } from "@/lib/site";
import { getCertifications, getExperience } from "@/app/actions/content";

export const metadata: Metadata = {
  title: "About",
  description: `Learn more about ${site.author.name}, a ${site.author.jobTitle} in ${site.author.location} specializing in SOC operations, threat detection, and incident response.`,
  alternates: { canonical: `${site.url}/about` },
  openGraph: {
    title: `About ${site.author.name}`,
    description: site.description,
    url: `${site.url}/about`,
    type: "profile",
  },
};

export default async function AboutPage() {
  let certifications: Awaited<ReturnType<typeof getCertifications>> = [];
  let experiences: Awaited<ReturnType<typeof getExperience>> = [];

  try {
    [certifications, experiences] = await Promise.all([
      getCertifications(),
      getExperience(),
    ]);
  } catch {
    // Gracefully fall back
  }

  return (
    <main className="scroll-mt-24 py-[96px] max-md:py-[64px]">
      <Container className="max-w-3xl">
        <Reveal>
          <SectionHeading index="01" eyebrow="About" title="Chibuike Nwozor" />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 space-y-6 text-muted leading-relaxed">
            <p>
              {site.author.name} is a {site.author.jobTitle} based in {site.author.location}, focused on building practical security systems for threat detection, monitoring, and defensive operations.
            </p>
            <p>
              With certifications in CompTIA Security+ and Cisco CyberOps Associate, the work centers on SOC operations, SIEM detection engineering, incident response, and network security analysis.
            </p>
            <p>
              This portfolio documents real projects, writeups, and technical work — no fabricated metrics or inflated claims. Each project represents genuine hands-on experience with security tools and workflows.
            </p>
          </div>
        </Reveal>

        {experiences.length > 0 && (
          <Reveal delay={0.15}>
            <div className="mt-16">
              <h2 className="font-display text-xl font-medium text-foreground mb-6">Experience</h2>
              <div className="border-l border-line pl-4 sm:pl-8 space-y-10">
                {experiences.map((role) => (
                  <article key={role.id} className="relative">
                    <span className="absolute -left-[33px] top-1.5 hidden h-2 w-2 rounded-full bg-accent sm:block" aria-hidden="true" />
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-2">{role.period}</p>
                    <h3 className="font-display text-lg font-medium text-foreground">{role.role}</h3>
                    <p className="font-mono text-xs uppercase tracking-[0.12em] text-accent mt-1">{role.company}</p>
                    {role.notes.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {role.notes.map((note, j) => (
                          <li key={j} className="text-sm text-muted">{note}</li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {certifications.length > 0 && (
          <Reveal delay={0.2}>
            <div className="mt-16">
              <h2 className="font-display text-xl font-medium text-foreground mb-6">Certifications</h2>
              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex items-start gap-4 rounded-lg border border-line bg-surface/40 p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-accent/30 bg-accent/5 font-display text-lg font-medium text-accent">
                      {cert.initial}
                    </div>
                    <div>
                      <h3 className="font-display text-base font-medium text-foreground">{cert.name}</h3>
                      <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted mt-1">{cert.issuer}</p>
                      {cert.url && (
                        <a href={cert.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block font-mono text-xs text-accent hover:underline">
                          Verify ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        <Reveal delay={0.25}>
          <div className="mt-16 pt-8 border-t border-line">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
            >
              ← Back to Home
            </Link>
          </div>
        </Reveal>
      </Container>
    </main>
  );
}
