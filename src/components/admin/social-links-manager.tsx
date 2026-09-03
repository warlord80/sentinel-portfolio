"use client";

import { useState } from "react";
import {
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
} from "@/app/actions/admin";
import type { SocialLink } from "@/lib/types";

interface SocialLinksPageProps {
  links: SocialLink[];
}

const ICON_OPTIONS = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "x", label: "X / Twitter" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "github", label: "GitHub" },
  { value: "email", label: "Email" },
];

export function SocialLinksManager({ links: initial }: SocialLinksPageProps) {
  const [links, setLinks] = useState(initial);
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [msg, setMsg] = useState("");

  const blank: Omit<SocialLink, "id" | "created_at" | "updated_at"> = {
    name: "",
    href: "",
    icon: "linkedin",
    order_index: links.length,
    enabled: true,
  };

  const handleSave = async (data: Omit<SocialLink, "id" | "created_at" | "updated_at">, id?: string) => {
    if (id) {
      const { error } = await updateSocialLink(id, data);
      if (error) { setMsg(error); return; }
      setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, ...data } : l)));
    } else {
      const { error } = await createSocialLink(data);
      if (error) { setMsg(error); return; }
      window.location.reload();
    }
    setEditing(null);
    setShowNew(false);
    setMsg("Saved.");
    setTimeout(() => setMsg(""), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this link?")) return;
    const { error } = await deleteSocialLink(id);
    if (error) { setMsg(error); return; }
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  const handleToggle = async (link: SocialLink) => {
    const { error } = await updateSocialLink(link.id, { enabled: !link.enabled });
    if (error) { setMsg(error); return; }
    setLinks((prev) => prev.map((l) => (l.id === link.id ? { ...l, enabled: !l.enabled } : l)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-foreground">Social Links</h1>
          <p className="mt-1 font-sans text-sm text-muted">{links.length} links</p>
        </div>
        <button
          onClick={() => { setShowNew(true); setEditing(null); }}
          className="rounded-sm border border-line bg-surface px-4 py-2 font-mono text-xs uppercase tracking-wider text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          + New
        </button>
      </div>

      {msg && <p className="font-sans text-sm text-accent" role="status" aria-live="polite">{msg}</p>}

      {(showNew || editing) && (
        <SocialLinkForm
          initial={editing ?? blank}
          onSave={(data) => handleSave(data, editing?.id)}
          onCancel={() => { setEditing(null); setShowNew(false); }}
        />
      )}

      <div className="space-y-2">
        {links.map((link) => (
          <div
            key={link.id}
            className="flex items-center justify-between rounded-sm border border-line bg-surface/50 px-4 py-3 transition-colors hover:border-accent/50"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted capitalize">{link.icon}</span>
              <div>
                <p className="font-sans text-sm text-foreground">{link.name}</p>
                <p className="font-mono text-xs text-muted truncate max-w-xs">{link.href}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggle(link)}
                className={`rounded-sm border px-3 py-1 font-mono text-xs ${link.enabled ? "border-accent/50 text-accent" : "border-line text-muted"}`}
              >
                {link.enabled ? "On" : "Off"}
              </button>
              <button onClick={() => { setEditing(link); setShowNew(false); }} className="rounded-sm border border-line px-4 py-2 font-mono text-xs text-muted hover:border-accent hover:text-accent">Edit</button>
              <button onClick={() => handleDelete(link.id)} aria-label={`Delete ${link.name}`} className="rounded-sm border border-line px-4 py-2 font-mono text-xs text-muted hover:border-red-500 hover:text-red-400">Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SocialLinkForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Omit<SocialLink, "id" | "created_at" | "updated_at">;
  onSave: (data: Omit<SocialLink, "id" | "created_at" | "updated_at">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);

  const set = (key: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="rounded-sm border border-accent/30 bg-surface p-5 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Name</label>
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="LinkedIn"
            className="w-full rounded-sm border border-line bg-background px-3 py-2 font-sans text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">URL</label>
          <input
            value={form.href}
            onChange={(e) => set("href", e.target.value)}
            placeholder="https://linkedin.com/in/..."
            className="w-full rounded-sm border border-line bg-background px-3 py-2 font-sans text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Icon</label>
          <select
            value={form.icon}
            onChange={(e) => set("icon", e.target.value)}
            className="w-full rounded-sm border border-line bg-background px-3 py-2 font-sans text-sm text-foreground focus:border-accent focus:outline-none"
          >
            {ICON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Order</label>
          <input
            type="number"
            value={form.order_index}
            onChange={(e) => set("order_index", Number(e.target.value))}
            className="w-full rounded-sm border border-line bg-background px-3 py-2 font-sans text-sm text-foreground focus:border-accent focus:outline-none"
          />
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={() => onSave(form)} className="rounded-sm border border-accent bg-accent/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-accent hover:bg-accent/20">Save</button>
        <button onClick={onCancel} className="rounded-sm border border-line px-4 py-2 font-mono text-xs uppercase tracking-wider text-muted hover:text-foreground">Cancel</button>
      </div>
    </div>
  );
}
