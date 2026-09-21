import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { Container } from "@/components/layout/container";
import { getWriteupBySlug } from "@/app/actions/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const writeup = await getWriteupBySlug(slug);
  if (!writeup) return { title: "Writeup Not Found" };

  return {
    title: `${writeup.title} | Chibuike Nwozor`,
    description: writeup.content?.slice(0, 160) || writeup.title,
    openGraph: {
      title: writeup.title,
      description: writeup.content?.slice(0, 160) || writeup.title,
      type: "article",
    },
  };
}

export default async function WriteupPage({ params }: Props) {
  const { slug } = await params;
  const writeup = await getWriteupBySlug(slug);

  if (!writeup) notFound();

  return (
    <article className="scroll-mt-24 py-[96px] max-md:py-[64px]">
      <Container className="max-w-3xl">
        {/* Back link */}
        <Link
          href="/#writeups"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent mb-12"
        >
          ← Back to Journal
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.14em] text-muted mb-4">
            <time>{writeup.date}</time>
            <span className="opacity-60">{writeup.read}</span>
          </div>
          <h1 className="font-display text-[clamp(1.75rem,5vw,3.5rem)] font-medium leading-tight tracking-[-0.02em] text-foreground">
            {writeup.title}
          </h1>
        </header>

        {/* Content */}
        {writeup.content ? (
          <div className="prose-sentinel">
            <ReactMarkdown>{writeup.content}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-muted text-lg">This writeup has no content yet.</p>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-line">
          <Link
            href="/#writeups"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
          >
            ← Back to Journal
          </Link>
        </footer>
      </Container>
    </article>
  );
}
