import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { site } from "@/lib/site";
import { getCertifications } from "@/app/actions/content";

export const metadata: Metadata = {
  title: "Certifications",
  description: `Professional certifications held by ${site.author.name}: CompTIA Security+ and Cisco CyberOps Associate.`,
  alternates: { canonical: `${site.url}/certifications` },
  openGraph: {
    title: `Certifications — ${site.author.name}`,
    description: `Professional certifications held by ${site.author.name}.`,
    url: `${site.url}/certifications`,
  },
};

export default async function CertificationsPage() {
  let certifications: Awaited<ReturnType<typeof getCertifications>> = [];

  try {
    certifications = await getCertifications();
  } catch {
    // Gracefully fall back
  }

  return (
    <main className="scroll-mt-24 py-[96px] max-md:py-[64px]">
      <Container className="max-w-3xl">
        <Reveal>
          <SectionHeading index="02" eyebrow="Credentials" title="Certifications" />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 space-y-4">
            {certifications.length > 0 ? (
              certifications.map((cert) => (
                <article key={cert.id} className="group flex items-start gap-5 rounded-lg border border-line bg-surface/40 p-6 transition-all duration-220 hover:border-accent/50 hover:bg-surface/60">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-accent/30 bg-accent/5 font-display text-xl font-medium text-accent transition-colors group-hover:border-accent/60 group-hover:bg-accent/10">
                    {cert.initial}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-lg font-medium text-foreground">{cert.name}</h3>
                    <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">{cert.issuer}</p>
                    {cert.url && (
                      <a href={cert.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block font-mono text-xs text-accent hover:underline">
                        Verify Credential ↗
                      </a>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <p className="text-muted">No certifications added yet.</p>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
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
