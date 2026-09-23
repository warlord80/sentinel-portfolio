import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Tag } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";
import { getProjectBySlug } from "@/app/actions/content";
import { site } from "@/lib/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  const description = project.description || `${project.title} — ${project.category} project by ${site.author.name}.`;
  const url = `${site.url}/projects/${project.slug}`;

  return {
    title: `${project.title} | Project`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: project.title,
      description,
      url,
      type: "article",
      images: project.image ? [{ url: project.image, width: 1200, height: 630, alt: project.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
      images: project.image ? [project.image] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: `${site.url}/projects/${project.slug}`,
    author: {
      "@type": "Person",
      name: site.author.name,
      url: site.url,
    },
    genre: project.category,
    keywords: project.tech.join(", "),
    image: project.image || undefined,
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
            href="/#projects"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent mb-12"
          >
            ← Back to Projects
          </Link>

          <header className="mb-12">
            <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.14em] text-muted mb-4">
              <span>{project.number}</span>
              <Tag>{project.category}</Tag>
              {project.status && <Tag>{project.status}</Tag>}
            </div>
            <h1 className="font-display text-[clamp(1.75rem,5vw,3.5rem)] font-medium leading-tight tracking-[-0.02em] text-foreground">
              {project.title}
            </h1>
            <p className="mt-4 max-w-prose text-lg text-muted leading-relaxed">
              {project.description}
            </p>
          </header>

          {project.image && (
            <div className="mb-12 overflow-hidden rounded-lg border border-line">
              <Image
                src={project.image}
                alt={`${project.title} screenshot`}
                width={1200}
                height={630}
                className="w-full object-cover"
                priority
              />
            </div>
          )}

          <div className="prose-sentinel">
            <section className="mb-10">
              <h2 className="font-display text-xl font-medium text-foreground mb-4">Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </section>

            <section className="mb-10">
              <h2 className="font-display text-xl font-medium text-foreground mb-4">Project Overview</h2>
              <p className="text-muted leading-relaxed">{project.description}</p>
            </section>

            {project.url && (
              <section className="mb-10">
                <h2 className="font-display text-xl font-medium text-foreground mb-4">Live Project</h2>
                <Button href={project.url} variant="primary" size="md" target="_blank" rel="noopener noreferrer">
                  View Live Project ↗
                </Button>
              </section>
            )}
          </div>

          <footer className="mt-16 pt-8 border-t border-line">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
            >
              ← Back to Projects
            </Link>
          </footer>
        </Container>
      </article>
    </>
  );
}
