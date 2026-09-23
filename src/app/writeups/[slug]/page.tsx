import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { Container } from "@/components/layout/container";
import { getWriteupBySlug } from "@/app/actions/content";
import { site } from "@/lib/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const writeup = await getWriteupBySlug(slug);
  if (!writeup) return { title: "Writeup Not Found" };

  const description = writeup.summary || writeup.content?.slice(0, 160) || writeup.title;
  const url = `${site.url}/writeups/${writeup.slug}`;

  return {
    title: writeup.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: writeup.title,
      description,
      url,
      type: "article",
      publishedTime: writeup.created_at || undefined,
      modifiedTime: writeup.updated_at || undefined,
      authors: [site.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: writeup.title,
      description,
    },
  };
}

export default async function WriteupPage({ params }: Props) {
  const { slug } = await params;
  const writeup = await getWriteupBySlug(slug);

  if (!writeup) notFound();

  const description = writeup.summary || writeup.content?.slice(0, 160) || writeup.title;
  const url = `${site.url}/writeups/${writeup.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: writeup.title,
    description,
    url,
    author: {
      "@type": "Person",
      name: site.author.name,
      url: site.url,
    },
    publisher: {
      "@type": "Person",
      name: site.author.name,
      url: site.url,
    },
    datePublished: writeup.created_at || undefined,
    dateModified: writeup.updated_at || undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="scroll-mt-24 py-[96px] max-md:py-[64px]">
        <Container className="max-w-3xl">
          <Link
            href="/#writeups"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent mb-12"
          >
            ← Back to Journal
          </Link>

          <header className="mb-12">
            <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.14em] text-muted mb-4">
              <time dateTime={writeup.created_at}>{writeup.date}</time>
              <span className="opacity-60">{writeup.read}</span>
            </div>
            <h1 className="font-display text-[clamp(1.75rem,5vw,3.5rem)] font-medium leading-tight tracking-[-0.02em] text-foreground">
              {writeup.title}
            </h1>
            {writeup.summary && (
              <p className="mt-4 max-w-prose text-lg text-muted leading-relaxed">
                {writeup.summary}
              </p>
            )}
          </header>

          {writeup.content ? (
            <div className="prose-sentinel">
              <ReactMarkdown>{writeup.content}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-muted text-lg">This writeup has no content yet.</p>
          )}

          {/* Author box */}
          <footer className="mt-16 pt-8 border-t border-line">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-accent/30 bg-accent/5 font-display text-lg font-medium text-accent">
                CN
              </div>
              <div>
                <p className="font-display text-sm font-medium text-foreground">
                  <Link href="/about" className="hover:text-accent transition-colors">
                    {site.author.name}
                  </Link>
                </p>
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted mt-1">
                  {site.author.jobTitle}
                </p>
                <div className="mt-2 flex gap-3">
                  <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-accent hover:underline">
                    LinkedIn ↗
                  </a>
                  <a href={site.social.x} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-accent hover:underline">
                    X ↗
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/#writeups"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
              >
                ← Back to Journal
              </Link>
            </div>
          </footer>
        </Container>
      </article>
    </>
  );
}
