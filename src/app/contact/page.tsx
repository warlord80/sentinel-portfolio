import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Contact } from "@/components/sections/contact";
import { site } from "@/lib/site";
import { getEnabledSocialLinks } from "@/app/actions/admin";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.author.name} for cybersecurity opportunities, questions, or collaborations.`,
  alternates: { canonical: `${site.url}/contact` },
  openGraph: {
    title: `Contact ${site.author.name}`,
    description: `Get in touch with ${site.author.name}.`,
    url: `${site.url}/contact`,
  },
};

export default async function ContactPage() {
  let socialLinks: Awaited<ReturnType<typeof getEnabledSocialLinks>> = [];

  try {
    socialLinks = await getEnabledSocialLinks();
  } catch {
    // Gracefully fall back
  }

  return (
    <main className="scroll-mt-24 py-[96px] max-md:py-[64px]">
      <Container>
        <Reveal>
          <SectionHeading index="03" eyebrow="Get in touch" title="Contact" />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12">
            <Contact socialLinks={socialLinks} />
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
