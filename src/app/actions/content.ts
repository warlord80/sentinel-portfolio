"use server";

import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizeString, sanitizeEmail } from "@/lib/sanitize";
import { headers } from "next/headers";
import type { Project, Experience, Certification, Writeup } from "@/lib/types";

// ── Projects ─────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "Published")
    .order("order", { ascending: true });

  if (error) {
    console.error("getProjects:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getAllProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("order", { ascending: true });

  if (error) {
    console.error("getAllProjects:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}

// ── Experience ───────────────────────────────────────────────────

export async function getExperience(): Promise<Experience[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experience")
    .select("*")
    .order("order", { ascending: true });

  if (error) {
    console.error("getExperience:", error.message);
    return [];
  }
  return data ?? [];
}

// ── Certifications ───────────────────────────────────────────────

export async function getCertifications(): Promise<Certification[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("certifications")
    .select("*")
    .order("order", { ascending: true });

  if (error) {
    console.error("getCertifications:", error.message);
    return [];
  }
  return data ?? [];
}

// ── Writeups ─────────────────────────────────────────────────────

export async function getWriteups(): Promise<Writeup[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("writeups")
    .select("*")
    .order("order", { ascending: true });

  if (error) {
    console.error("getWriteups:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getWriteupBySlug(slug: string): Promise<Writeup | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("writeups")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}

// ── Contact ──────────────────────────────────────────────────────

export async function submitContact(
  _prev: { success: boolean; error: string } | null,
  formData: FormData,
): Promise<{ success: boolean; error: string }> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  // Read IP from server-side headers (not client-supplied form data)
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() ?? "unknown";

  // Rate limit: 5 submissions per minute per IP
  const rateLimit = checkRateLimit(`contact:${ip}`, 5, 60_000);
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: `Too many submissions. Try again in ${rateLimit.retryAfter}s.`,
    };
  }

  // Validate
  if (!name || !email || !message) {
    return { success: false, error: "All fields are required." };
  }

  // Sanitize inputs
  const cleanName = sanitizeString(name, 100);
  const cleanEmail = sanitizeEmail(email);
  const cleanMessage = sanitizeString(message, 2000);

  if (!cleanName || !cleanEmail || !cleanMessage) {
    return { success: false, error: "Invalid input." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_submissions").insert({
    name: cleanName,
    email: cleanEmail,
    message: cleanMessage,
  });

  if (error) {
    console.error("submitContact:", error.message);
    return { success: false, error: "Failed to send message. Please try again." };
  }

  return { success: true, error: "" };
}
