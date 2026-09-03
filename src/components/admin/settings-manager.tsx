"use client";

import { useState } from "react";
import { updateSiteSettings } from "@/app/actions/admin";
import type { SiteSettings } from "@/lib/types";

export function SettingsManager({ settings }: { settings: SiteSettings | null }) {
  const [form, setForm] = useState(settings);
  const [msg, setMsg] = useState("");

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

  const cls = "w-full rounded-sm border border-line bg-background px-3 py-2 font-sans text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-foreground">Site Settings</h1>
          <p className="mt-1 font-sans text-sm text-muted">Global content configuration.</p>
        </div>
        <button onClick={handleSave} className="rounded-sm border border-accent bg-accent/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-accent hover:bg-accent/20">Save</button>
      </div>
      {msg && <p className="font-sans text-sm text-accent">{msg}</p>}
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
