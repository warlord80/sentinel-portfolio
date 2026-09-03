"use client";

import { useState } from "react";
import { createCertification, updateCertification, deleteCertification } from "@/app/actions/admin";
import type { Certification } from "@/lib/types";

export function CertificationsManager({ items: initial }: { items: Certification[] }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<Certification | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [msg, setMsg] = useState("");

  const blank: Omit<Certification, "id" | "created_at" | "updated_at"> = { initial: "?", name: "", issuer: "", order: items.length };

  const handleSave = async (data: Omit<Certification, "id" | "created_at" | "updated_at">, id?: string) => {
    if (id) {
      const { error } = await updateCertification(id, data);
      if (error) { setMsg(error); return; }
      setItems((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    } else {
      const { error } = await createCertification(data);
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
    const { error } = await deleteCertification(id);
    if (error) { setMsg(error); return; }
    setItems((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-foreground">Certifications</h1>
          <p className="mt-1 font-sans text-sm text-muted">{items.length} certifications</p>
        </div>
        <button onClick={() => { setShowNew(true); setEditing(null); }} className="rounded-sm border border-line bg-surface px-4 py-2 font-mono text-xs uppercase tracking-wider text-foreground transition-colors hover:border-accent hover:text-accent">+ New</button>
      </div>
      {msg && <p className="font-sans text-sm text-accent">{msg}</p>}
      {(showNew || editing) && (
        <CertForm initial={editing ?? blank} onSave={(d) => handleSave(d, editing?.id)} onCancel={() => { setEditing(null); setShowNew(false); }} />
      )}
      <div className="space-y-2">
        {items.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-sm border border-line bg-surface/50 px-4 py-3 transition-colors hover:border-accent/50">
            <div className="min-w-0 flex-1">
              <p className="truncate font-sans text-sm text-foreground">{c.name}</p>
              <p className="font-mono text-xs text-muted">{c.issuer}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditing(c); setShowNew(false); }} className="rounded-sm border border-line px-3 py-1 font-mono text-xs text-muted hover:border-accent hover:text-accent">Edit</button>
              <button onClick={() => handleDelete(c.id)} className="rounded-sm border border-line px-3 py-1 font-mono text-xs text-muted hover:border-red-500 hover:text-red-400">Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CertForm({ initial, onSave, onCancel }: { initial: Omit<Certification, "id" | "created_at" | "updated_at">; onSave: (d: Omit<Certification, "id" | "created_at" | "updated_at">) => void; onCancel: () => void }) {
  const [form, setForm] = useState(initial);
  const set = (key: string, value: string | number) => setForm((p) => ({ ...p, [key]: value }));
  const cls = "w-full rounded-sm border border-line bg-background px-3 py-2 font-sans text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none";

  return (
    <div className="rounded-sm border border-accent/30 bg-surface p-5 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1"><label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Name</label><input value={form.name} onChange={(e) => set("name", e.target.value)} className={cls} /></div>
        <div className="flex flex-col gap-1"><label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Issuer</label><input value={form.issuer} onChange={(e) => set("issuer", e.target.value)} className={cls} /></div>
        <div className="flex flex-col gap-1"><label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Initial</label><input value={form.initial} onChange={(e) => set("initial", e.target.value)} className={cls} maxLength={2} /></div>
        <div className="flex flex-col gap-1"><label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">URL</label><input value={form.url ?? ""} onChange={(e) => set("url", e.target.value)} className={cls} /></div>
        <div className="flex flex-col gap-1"><label className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Order</label><input value={String(form.order)} onChange={(e) => set("order", Number(e.target.value))} className={cls} /></div>
      </div>
      <div className="flex gap-3">
        <button onClick={() => onSave(form)} className="rounded-sm border border-accent bg-accent/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-accent hover:bg-accent/20">Save</button>
        <button onClick={onCancel} className="rounded-sm border border-line px-4 py-2 font-mono text-xs uppercase tracking-wider text-muted hover:text-foreground">Cancel</button>
      </div>
    </div>
  );
}
