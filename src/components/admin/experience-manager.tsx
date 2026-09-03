"use client";

import { useState } from "react";
import { createExperience, updateExperience, deleteExperience } from "@/app/actions/admin";
import type { Experience } from "@/lib/types";

export function ExperienceManager({ items: initial }: { items: Experience[] }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [msg, setMsg] = useState("");

  const blank: Omit<Experience, "id" | "created_at" | "updated_at"> = {
    period: "",
    role: "",
    company: "",
    notes: [],
    order: items.length,
  };

  const handleSave = async (data: Omit<Experience, "id" | "created_at" | "updated_at">, id?: string) => {
    if (id) {
      const { error } = await updateExperience(id, data);
      if (error) { setMsg(error); return; }
      setItems((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));
    } else {
      const { error } = await createExperience(data);
      if (error) { setMsg(error); return; }
      window.location.reload();
    }
    setEditing(null);
    setShowNew(false);
    setMsg("Saved.");
    setTimeout(() => setMsg(""), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    const { error } = await deleteExperience(id);
    if (error) { setMsg(error); return; }
    setItems((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-foreground">Experience</h1>
          <p className="mt-1 font-sans text-sm text-muted">{items.length} entries</p>
        </div>
        <button onClick={() => { setShowNew(true); setEditing(null); }} className="rounded-sm border border-line bg-surface px-4 py-2 font-mono text-xs uppercase tracking-wider text-foreground transition-colors hover:border-accent hover:text-accent">+ New</button>
      </div>

      {msg && <p className="font-sans text-sm text-accent">{msg}</p>}

      {(showNew || editing) && (
        <ExperienceForm
          initial={editing ?? blank}
          onSave={(data) => handleSave(data, editing?.id)}
          onCancel={() => { setEditing(null); setShowNew(false); }}
        />
      )}

      <div className="space-y-2">
        {items.map((e) => (
          <div key={e.id} className="flex items-center justify-between rounded-sm border border-line bg-surface/50 px-4 py-3 transition-colors hover:border-accent/50">
            <div className="min-w-0 flex-1">
              <p className="truncate font-sans text-sm text-foreground">{e.role} — {e.company}</p>
              <p className="font-mono text-xs text-muted">{e.period}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditing(e); setShowNew(false); }} className="rounded-sm border border-line px-3 py-1 font-mono text-xs text-muted hover:border-accent hover:text-accent">Edit</button>
              <button onClick={() => handleDelete(e.id)} className="rounded-sm border border-line px-3 py-1 font-mono text-xs text-muted hover:border-red-500 hover:text-red-400">Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperienceForm({ initial, onSave, onCancel }: { initial: Omit<Experience, "id" | "created_at" | "updated_at">; onSave: (d: Omit<Experience, "id" | "created_at" | "updated_at">) => void; onCancel: () => void }) {
  const [form, setForm] = useState(initial);
  const set = (key: string, value: string | number | string[]) => setForm((p) => ({ ...p, [key]: value }));
  const cls = "w-full rounded-sm border border-line bg-background px-3 py-2 font-sans text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none";

  return (
    <div className="rounded-sm border border-accent/30 bg-surface p-5 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1"><label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Role</label><input value={form.role} onChange={(e) => set("role", e.target.value)} className={cls} /></div>
        <div className="flex flex-col gap-1"><label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Company</label><input value={form.company} onChange={(e) => set("company", e.target.value)} className={cls} /></div>
        <div className="flex flex-col gap-1"><label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Period</label><input value={form.period} onChange={(e) => set("period", e.target.value)} className={cls} placeholder="2023 — Present" /></div>
        <div className="flex flex-col gap-1"><label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Order</label><input value={String(form.order)} onChange={(e) => set("order", Number(e.target.value))} className={cls} /></div>
      </div>
      <div className="flex flex-col gap-1"><label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Notes (one per line)</label><textarea value={form.notes.join("\n")} onChange={(e) => set("notes", e.target.value.split("\n").filter(Boolean))} rows={4} className={cls} /></div>
      <div className="flex gap-3">
        <button onClick={() => onSave(form)} className="rounded-sm border border-accent bg-accent/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-accent hover:bg-accent/20">Save</button>
        <button onClick={onCancel} className="rounded-sm border border-line px-4 py-2 font-mono text-xs uppercase tracking-wider text-muted hover:text-foreground">Cancel</button>
      </div>
    </div>
  );
}
