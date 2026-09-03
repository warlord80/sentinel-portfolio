"use client";

import { useState, useRef } from "react";
import { updateSiteSettings, uploadResume, setResumeUrl } from "@/app/actions/admin";
import type { SiteSettings } from "@/lib/types";

export function SettingsManager({ settings }: { settings: SiteSettings | null }) {
  const [form, setForm] = useState(settings);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!form) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-medium text-foreground">Settings</h1>
        <p className="font-sans text-sm text-muted">No settings found. Create a row in the site_settings table.</p>
      </div>
    );
  }

  const set = (key: string, value: string) => setForm((p) => p ? { ...p, [key]: value } : null);

  const handleSave = async () => {
    if (!form) return;
    const { error } = await updateSiteSettings(form.id, form);
    if (error) { setMsg(error); return; }
    setMsg("Saved.");
    setTimeout(() => setMsg(""), 2000);
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { error, url } = await uploadResume(file);
    if (error || !url) {
      setUploading(false);
      setMsg(error ?? "Upload failed");
      return;
    }
    const { error: saveError } = await setResumeUrl(url);
    setUploading(false);
    if (saveError) { setMsg(saveError); return; }
    set("resume_url", url);
    setMsg("Resume uploaded.");
    setTimeout(() => setMsg(""), 2000);
  };

  const cls = "w-full rounded-sm border border-line bg-background px-3 py-2 font-sans text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-foreground">Site Settings</h1>
          <p className="mt-1 font-sans text-sm text-muted">Global content configuration.</p>
        </div>
        <button onClick={handleSave} className="rounded-sm border border-accent bg-accent/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-accent hover:bg-accent/20">Save</button>
      </div>
      {msg && <p className="font-sans text-sm text-accent">{msg}</p>}

      {/* Resume Upload */}
      <div className="rounded-sm border border-line bg-surface/50 p-5">
        <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-muted">Resume / CV</h2>
        <div className="mt-4 flex items-center gap-4">
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleResumeUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="rounded-sm border border-line bg-background px-4 py-2 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          >
            {uploading ? "Uploading..." : form.resume_url ? "Replace PDF" : "Upload PDF"}
          </button>
          {form.resume_url && (
            <a href={form.resume_url} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-accent hover:underline">
              View current resume
            </a>
          )}
        </div>
      </div>

      {/* Content Settings */}
      <div className="max-w-xl space-y-4">
        <div className="flex flex-col gap-1"><label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Hero Tagline</label><input value={form.hero_tagline} onChange={(e) => set("hero_tagline", e.target.value)} className={cls} /></div>
        <div className="flex flex-col gap-1"><label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Hero Subtitle</label><textarea value={form.hero_subtitle} onChange={(e) => set("hero_subtitle", e.target.value)} rows={3} className={cls} /></div>
        <div className="flex flex-col gap-1"><label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">About Text</label><textarea value={form.about_text} onChange={(e) => set("about_text", e.target.value)} rows={4} className={cls} /></div>
        <div className="flex flex-col gap-1"><label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">About Focus</label><input value={form.about_focus} onChange={(e) => set("about_focus", e.target.value)} className={cls} /></div>
        <div className="flex flex-col gap-1"><label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Base Location</label><input value={form.about_base} onChange={(e) => set("about_base", e.target.value)} className={cls} /></div>
        <div className="flex flex-col gap-1"><label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Status</label><input value={form.about_status} onChange={(e) => set("about_status", e.target.value)} className={cls} /></div>
      </div>
    </div>
  );
}
