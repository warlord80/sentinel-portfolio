"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import type { Project, Experience, Certification, Writeup, SiteSettings, SocialLink } from "@/lib/types";

/**
 * Verify the current user is authenticated. Returns the authenticated user
 * or null if not authenticated.
 */
async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { supabase: null, error: "Unauthorized" as const };
  }
  return { supabase, error: null };
}

// ── Projects ─────────────────────────────────────────────────────

export async function uploadProjectImage(file: File) {
  const auth = await requireAuth();
  if (auth.error) return { error: auth.error, url: null as string | null };

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `projects/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await auth.supabase!.storage.from("project-images").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) return { error: error.message, url: null as string | null };

  const { data } = auth.supabase!.storage.from("project-images").getPublicUrl(path);
  return { error: null, url: data.publicUrl };
}

export async function deleteProjectImage(path: string) {
  const auth = await requireAuth();
  if (auth.error) return { error: auth.error };
  const { error } = await auth.supabase!.storage.from("project-images").remove([path]);
  if (error) return { error: error.message };
  return { error: null };
}

export async function createProject(data: Omit<Project, "id" | "created_at" | "updated_at">) {
  const auth = await requireAuth();
  if (auth.error) return { error: auth.error };
  const { error } = await auth.supabase!.from("projects").insert(data);
  if (error) return { error: error.message };
  return { error: null };
}

export async function updateProject(id: string, data: Partial<Project>) {
  const auth = await requireAuth();
  if (auth.error) return { error: auth.error };
  const { error } = await auth.supabase!.from("projects").update(data).eq("id", id);
  if (error) return { error: error.message };
  return { error: null };
}

export async function deleteProject(id: string) {
  const auth = await requireAuth();
  if (auth.error) return { error: auth.error };
  const { error } = await auth.supabase!.from("projects").delete().eq("id", id);
  if (error) return { error: error.message };
  return { error: null };
}

// ── Experience ───────────────────────────────────────────────────

export async function createExperience(data: Omit<Experience, "id" | "created_at" | "updated_at">) {
  const auth = await requireAuth();
  if (auth.error) return { error: auth.error };
  const { error } = await auth.supabase!.from("experience").insert(data);
  if (error) return { error: error.message };
  return { error: null };
}

export async function updateExperience(id: string, data: Partial<Experience>) {
  const auth = await requireAuth();
  if (auth.error) return { error: auth.error };
  const { error } = await auth.supabase!.from("experience").update(data).eq("id", id);
  if (error) return { error: error.message };
  return { error: null };
}

export async function deleteExperience(id: string) {
  const auth = await requireAuth();
  if (auth.error) return { error: auth.error };
  const { error } = await auth.supabase!.from("experience").delete().eq("id", id);
  if (error) return { error: error.message };
  return { error: null };
}

// ── Certifications ───────────────────────────────────────────────

export async function createCertification(data: Omit<Certification, "id" | "created_at" | "updated_at">) {
  const auth = await requireAuth();
  if (auth.error) return { error: auth.error };
  const { error } = await auth.supabase!.from("certifications").insert(data);
  if (error) return { error: error.message };
  return { error: null };
}

export async function updateCertification(id: string, data: Partial<Certification>) {
  const auth = await requireAuth();
  if (auth.error) return { error: auth.error };
  const { error } = await auth.supabase!.from("certifications").update(data).eq("id", id);
  if (error) return { error: error.message };
  return { error: null };
}

export async function deleteCertification(id: string) {
  const auth = await requireAuth();
  if (auth.error) return { error: auth.error };
  const { error } = await auth.supabase!.from("certifications").delete().eq("id", id);
  if (error) return { error: error.message };
  return { error: null };
}

// ── Writeups ─────────────────────────────────────────────────────

export async function createWriteup(data: Omit<Writeup, "id" | "created_at" | "updated_at">) {
  const auth = await requireAuth();
  if (auth.error) return { error: auth.error };
  const { error } = await auth.supabase!.from("writeups").insert(data);
  if (error) return { error: error.message };
  return { error: null };
}

export async function updateWriteup(id: string, data: Partial<Writeup>) {
  const auth = await requireAuth();
  if (auth.error) return { error: auth.error };
  const { error } = await auth.supabase!.from("writeups").update(data).eq("id", id);
  if (error) return { error: error.message };
  return { error: null };
}

export async function deleteWriteup(id: string) {
  const auth = await requireAuth();
  if (auth.error) return { error: auth.error };
  const { error } = await auth.supabase!.from("writeups").delete().eq("id", id);
  if (error) return { error: error.message };
  return { error: null };
}

// ── Site Settings ────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("*").limit(1).single();
  if (error) return null;
  return data;
}

export async function updateSiteSettings(id: string, data: Partial<SiteSettings>) {
  const auth = await requireAuth();
  if (auth.error) return { error: auth.error };
  const { error } = await auth.supabase!.from("site_settings").update(data).eq("id", id);
  if (error) return { error: error.message };
  return { error: null };
}

// ── Contact Submissions ──────────────────────────────────────────

export async function getContactSubmissions() {
  const auth = await requireAuth();
  if (auth.error) return [];
  const { data, error } = await auth.supabase!
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function updateSubmissionStatus(id: string, status: "pending" | "read" | "archived") {
  const auth = await requireAuth();
  if (auth.error) return { error: auth.error };
  const { error } = await auth.supabase!.from("contact_submissions").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  return { error: null };
}

export async function deleteSubmission(id: string) {
  const auth = await requireAuth();
  if (auth.error) return { error: auth.error };
  const { error } = await auth.supabase!.from("contact_submissions").delete().eq("id", id);
  if (error) return { error: error.message };
  return { error: null };
}

// ── Analytics ────────────────────────────────────────────────────

export async function trackPageView(path: string, section?: string) {
  const supabase = await createClient();
  // Simple hash of IP for privacy
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() ?? "unknown";
  const ipHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip)).then(
    (buf) => Array.from(new Uint8Array(buf).slice(0, 8)).map((b) => b.toString(16).padStart(2, "0")).join(""),
  );

  await supabase.from("page_views").insert({
    path,
    section: section ?? null,
    referrer: headersList.get("referer"),
    user_agent: headersList.get("user-agent")?.slice(0, 200),
    ip_hash: ipHash,
  });
}

export async function getAnalytics() {
  const auth = await requireAuth();
  if (auth.error) return { total: 0, today: 0, sections: [] as Array<{ section: string; count: number }> };

  const supabase = auth.supabase!;

  // Total views
  const { count: total } = await supabase
    .from("page_views")
    .select("*", { count: "exact", head: true });

  // Today's views
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { count: todayCount } = await supabase
    .from("page_views")
    .select("*", { count: "exact", head: true })
    .gte("created_at", today.toISOString());

  // Top sections
  const { data: sectionData } = await supabase
    .from("page_views")
    .select("section")
    .not("section", "is", null);

  const sectionCounts: Record<string, number> = {};
  if (sectionData) {
    for (const row of sectionData) {
      const s = row.section ?? "unknown";
      sectionCounts[s] = (sectionCounts[s] ?? 0) + 1;
    }
  }
  const sections = Object.entries(sectionCounts)
    .map(([section, count]) => ({ section, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return { total: total ?? 0, today: todayCount ?? 0, sections };
}

// ── Social Links ─────────────────────────────────────────────────

export async function getSocialLinks() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .order("order_index", { ascending: true });
  if (error) return [];
  return data ?? [];
}

export async function getEnabledSocialLinks() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .eq("enabled", true)
    .order("order_index", { ascending: true });
  if (error) return [];
  return data ?? [];
}

export async function createSocialLink(data: Omit<import("@/lib/types").SocialLink, "id" | "created_at" | "updated_at">) {
  const auth = await requireAuth();
  if (auth.error) return { error: auth.error };
  const { error } = await auth.supabase!.from("social_links").insert(data);
  if (error) return { error: error.message };
  return { error: null };
}

export async function updateSocialLink(id: string, data: Partial<import("@/lib/types").SocialLink>) {
  const auth = await requireAuth();
  if (auth.error) return { error: auth.error };
  const { error } = await auth.supabase!.from("social_links").update({ ...data, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) return { error: error.message };
  return { error: null };
}

export async function deleteSocialLink(id: string) {
  const auth = await requireAuth();
  if (auth.error) return { error: auth.error };
  const { error } = await auth.supabase!.from("social_links").delete().eq("id", id);
  if (error) return { error: error.message };
  return { error: null };
}

// ── Resume ───────────────────────────────────────────────────────

export async function uploadResume(file: File) {
  const auth = await requireAuth();
  if (auth.error) return { error: auth.error, url: null as string | null };

  const path = `resume/resume-${Date.now()}.${file.name.split(".").pop() ?? "pdf"}`;

  const { error } = await auth.supabase!.storage.from("project-images").upload(path, file, {
    contentType: file.type,
    upsert: true,
  });
  if (error) return { error: error.message, url: null as string | null };

  const { data } = auth.supabase!.storage.from("project-images").getPublicUrl(path);
  return { error: null, url: data.publicUrl };
}

export async function getResumeUrl() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("resume_url").limit(1).single();
  return data?.resume_url ?? "";
}

export async function setResumeUrl(url: string) {
  const auth = await requireAuth();
  if (auth.error) return { error: auth.error };
  // Upsert: update if exists, insert if not
  const { data: existing } = await auth.supabase!.from("site_settings").select("id").limit(1).single();
  if (existing) {
    const { error } = await auth.supabase!.from("site_settings").update({ resume_url: url }).eq("id", existing.id);
    if (error) return { error: error.message };
  }
  return { error: null };
}
