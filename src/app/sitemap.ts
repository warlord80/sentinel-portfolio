import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getProjects, getWriteups } from "@/app/actions/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site.url}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${site.url}/certifications`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${site.url}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic writeup pages
  let writeupPages: MetadataRoute.Sitemap = [];
  try {
    const writeups = await getWriteups();
    writeupPages = writeups.map((w) => ({
      url: `${site.url}/writeups/${w.slug}`,
      lastModified: new Date(w.updated_at || w.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // Gracefully handle Supabase failures
  }

  // Dynamic project pages
  let projectPages: MetadataRoute.Sitemap = [];
  try {
    const projects = await getProjects();
    projectPages = projects.map((p) => ({
      url: `${site.url}/projects/${p.slug}`,
      lastModified: new Date(p.updated_at || p.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // Gracefully handle Supabase failures
  }

  return [...staticPages, ...writeupPages, ...projectPages];
}
