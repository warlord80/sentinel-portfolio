"use client";

import { useState } from "react";
import { createWriteup, updateWriteup, deleteWriteup } from "@/app/actions/admin";
import type { Writeup } from "@/lib/types";

export function WriteupsManager({ items: initial }: { items: Writeup[] }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<Writeup | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [msg, setMsg] = useState("");

  const blank: Omit<Writeup, "id" | "created_at" | "updated_at"> = { title: "", date: "", read: "5 min", slug: "", order: items.length };

  const handleSave = async (data: Omit<Writeup, "id" | "created_at" | "updated_at">, id?: string) => {
    if (id) {
      const { error } = await updateWriteup(id, data);
      if (error) { setMsg(error); return; }
      setItems((prev) => prev.map((w) => (w.id === id ? { ...w, ...data } : w)));
    } else {
      const { error } = await createWriteup(data);
      if (error) { setMsg(error); return; }
      window.location.reload();
    }
    setEditing(null);
    setShowNew(false);
    setMsg("Saved.");
    setTimeout(() => setMsg(""), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await deleteWriteup(id);
    if (error) { setMsg(error); return; }
    setItems((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-foreground">Writeups</h1>
          <p className="mt-1 font-sans text-sm text-muted">{items.length} writeups</p>
        </div>
        <button onClick={() => { setShowNew(true); setEditing(null); }} className="rounded-sm border border-line bg-surface px-4 py-2 font-mono text-xs uppercase tracking-wider text-foreground transition-colors hover:border-accent hover:text-accent">+ New</button>
      </div>
      {msg && <p className="font-sans text-sm text-accent">{msg}</p>}
      {(showNew || editing) && (
        <WriteupForm initial={editing ?? blank} onSave={(d) => handleSave(d, editing?.id)} onCancel={() => { setEditing(null); setShowNew(false); }} />
      )}
      <div className="space-y-2">
        {items.map((w) => (
          <div key={w.id} className="flex items-center justify-between rounded-sm border border-line bg-surface/50 px-4 py-3 transition-colors hover:border-accent/50">
            <div className="min-w-0 flex-1">
              <p className="truncate font-sans text-sm text-foreground">{w.title}</p>
              <p className="font-mono text-xs text-muted">{w.date} · {w.read}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditing(w); setShowNew(false); }} className="rounded-sm border border-line px-3 py-1 font-mono text-xs text-muted hover:border-accent hover:text-accent">Edit</button>
              <button onClick={() => handleDelete(w.id)} className="rounded-sm border border-line px-3 py-1 font-mono text-xs text-muted hover:border-red-500 hover:text-red-400">Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WriteupForm({ initial, onSave, onCancel }: { initial: Omit<Writeup, "id" | "created_at" | "updated_at">; onSave: (d: Omit<Writeup, "id" | "created_at" | "updated_at">) => void; onCancel: () => void }) {
  const [form, setForm] = useState(initial);
  const set = (key: string, value: string | number) => setForm((p) => ({ ...p, [key]: value }));
  const cls = "w-full rounded-sm border border-line bg-background px-3 py-2 font-sans text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none";

  return (
    <div className="rounded-sm border border-accent/30 bg-surface p-5 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1"><label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Title</label><input value={form.title} onChange={(e) => set("title", e.target.value)} className={cls} /></div>
        <div className="flex flex-col gap-1"><label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Slug</label><input value={form.slug} onChange={(e) => set("slug", e.target.value)} className={cls} /></div>
        <div className="flex flex-col gap-1"><label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Date</label><input value={form.date} onChange={(e) => set("date", e.target.value)} className={cls} placeholder="Sep 2026" /></div>
        <div className="flex flex-col gap-1"><label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Read time</label><input value={form.read} onChange={(e) => set("read", e.target.value)} className={cls} placeholder="5 min" /></div>
        <div className="flex flex-col gap-1"><label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Order</label><input value={String(form.order)} onChange={(e) => set("order", Number(e.target.value))} className={cls} /></div>
      </div>
      <div className="flex flex-col gap-1"><label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Content (Markdown)</label><textarea value={form.content ?? ""} onChange={(e) => set("content", e.target.value)} rows={10} className={cls} /></div>
      <div className="flex gap-3">
        <button onClick={() => onSave(form)} className="rounded-sm border border-accent bg-accent/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-accent hover:bg-accent/20">Save</button>
        <button onClick={onCancel} className="rounded-sm border border-line px-4 py-2 font-mono text-xs uppercase tracking-wider text-muted hover:text-foreground">Cancel</button>
      </div>
    </div>
  );
}
