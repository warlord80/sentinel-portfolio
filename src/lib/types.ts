// ──────────────────────────────────────────────────────────────────
// Content types — single source of truth for all CMS-managed models.
// Sections consume these types; the CMS writes to them via server actions.
// ──────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  tech: string[];
  status: "Draft" | "Published" | "Archived";
  description: string;
  /** URL slug for the project detail page */
  slug: string;
  /** Optional hero image path (relative to /public) */
  image?: string;
  /** Display order (lower = first) */
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  period: string;
  role: string;
  company: string;
  notes: string[];
  /** Start date for sorting (ISO 8601) */
  start_date?: string;
  /** Display order (lower = first) */
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: string;
  initial: string;
  name: string;
  issuer: string;
  /** Optional verification URL */
  url?: string;
  /** Display order (lower = first) */
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Writeup {
  id: string;
  title: string;
  date: string;
  read: string;
  /** URL slug for the writeup detail page */
  slug: string;
  /** Full markdown content */
  content?: string;
  /** Display order (lower = first) */
  order: number;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  /** "pending" | "read" | "archived" */
  status: "pending" | "read" | "archived";
  created_at: string;
}

export interface SiteSettings {
  id: string;
  /** Global site configuration */
  hero_tagline: string;
  hero_subtitle: string;
  about_text: string;
  about_focus: string;
  about_base: string;
  about_status: string;
  /** CMS-managed resume PDF URL */
  resume_url: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  name: string;
  href: string;
  /** Icon key: "linkedin" | "x" | "whatsapp" | "github" | "email" */
  icon: string;
  order_index: number;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface PageView {
  id: string;
  path: string;
  section: string | null;
  referrer: string | null;
  user_agent: string | null;
  ip_hash: string | null;
  created_at: string;
}
