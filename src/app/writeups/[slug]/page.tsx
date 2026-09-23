import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { Container } from "@/components/layout/container";
import { getWriteupBySlug, getWriteups, getProjects } from "@/app/actions/content";
import { site } from "@/lib/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const writeup = await getWriteupBySlug(slug);
  if (!writeup) return { title: "Writeup Not Found" };

  const description = writeup.summary || `${writeup.title} — a technical writeup by ${site.author.name}.`;
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
  const [writeup, allWriteups, allProjects] = await Promise.all([
    getWriteupBySlug(slug),
    getWriteups().catch(() => []),
    getProjects().catch(() => []),
  ]);

  if (!writeup) notFound();

  const description = writeup.summary || `${writeup.title} — a technical writeup by ${site.author.name}.`;
  const url = `${site.url}/writeups/${writeup.slug}`;

  // Related writeups (exclude current, take up to 2)
  const relatedWriteups = allWriteups
    .filter((w) => w.slug !== writeup.slug)
    .slice(0, 2);

  // Related projects (take up to 2)
  const relatedProjects = allProjects.slice(0, 2);

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
          <div className="mt-16 pt-8 border-t border-line">
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
          </div>

          {/* Related writeups */}
          {relatedWriteups.length > 0 && (
            <div className="mt-12 pt-8 border-t border-line">
              <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-muted mb-6">Related Writeups</h2>
              <div className="space-y-4">
                {relatedWriteups.map((w) => (
                  <Link
                    key={w.id}
                    href={`/writeups/${w.slug}`}
                    className="group block rounded-lg border border-line bg-surface/40 p-5 transition-all duration-220 hover:border-accent/50 hover:bg-surface/60"
                  >
                    <h3 className="font-display text-base font-medium text-foreground group-hover:text-accent transition-colors">
                      {w.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-3 font-mono text-xs text-muted">
                      <span>{w.date}</span>
                      <span className="opacity-60">{w.read}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related projects */}
          {relatedProjects.length > 0 && (
            <div className="mt-12 pt-8 border-t border-line">
              <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-muted mb-6">Related Projects</h2>
              <div className="space-y-4">
                {relatedProjects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.slug}`}
                    className="group block rounded-lg border border-line bg-surface/40 p-5 transition-all duration-220 hover:border-accent/50 hover:bg-surface/60"
                  >
                    <h3 className="font-display text-base font-medium text-foreground group-hover:text-accent transition-colors">
                      {p.title}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-muted">{p.category}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <footer className="mt-12 pt-8 border-t border-line">
            <Link
              href="/#writeups"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
            >
              ← Back to Journal
            </Link>
          </footer>
        </Container>
      </article>
    </>
  );
}
