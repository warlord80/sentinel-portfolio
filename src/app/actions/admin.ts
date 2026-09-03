"use server";

import { createClient } from "@/lib/supabase/server";
import type { Project, Experience, Certification, Writeup, SiteSettings } from "@/lib/types";

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
