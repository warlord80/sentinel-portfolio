"use client";

import { useState } from "react";
import { createProject, updateProject, deleteProject } from "@/app/actions/admin";
import type { Project } from "@/lib/types";

interface ProjectsPageProps {
  projects: Project[];
}

export function ProjectsManager({ projects: initial }: ProjectsPageProps) {
  const [projects, setProjects] = useState(initial);
  const [editing, setEditing] = useState<Project | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [msg, setMsg] = useState("");

  const blank: Omit<Project, "id" | "created_at" | "updated_at"> = {
    number: String(projects.length + 1).padStart(2, "0"),
    title: "",
    category: "",
    tech: [],
    status: "Draft",
    description: "",
    slug: "",
    order: projects.length,
  };

  const handleSave = async (data: Omit<Project, "id" | "created_at" | "updated_at">, id?: string) => {
    if (id) {
      const { error } = await updateProject(id, data);
      if (error) { setMsg(error); return; }
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
    } else {
      const { error } = await createProject(data);
      if (error) { setMsg(error); return; }
      window.location.reload();
    }
    setEditing(null);
    setShowNew(false);
    setMsg("Saved.");
    setTimeout(() => setMsg(""), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const { error } = await deleteProject(id);
    if (error) { setMsg(error); return; }
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-foreground">Projects</h1>
          <p className="mt-1 font-sans text-sm text-muted">{projects.length} projects</p>
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
        <ProjectForm
          initial={editing ?? blank}
          onSave={(data) => handleSave(data, editing?.id)}
          onCancel={() => { setEditing(null); setShowNew(false); }}
        />
      )}

      <div className="space-y-2">
        {projects.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-sm border border-line bg-surface/50 px-4 py-3 transition-colors hover:border-accent/50"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-sans text-sm text-foreground">{p.title}</p>
              <p className="font-mono text-xs text-muted">{p.category} · {p.status}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditing(p); setShowNew(false); }} className="rounded-sm border border-line px-4 py-2 font-mono text-xs text-muted hover:border-accent hover:text-accent">Edit</button>
              <button onClick={() => handleDelete(p.id)} aria-label={`Delete ${p.title}`} className="rounded-sm border border-line px-4 py-2 font-mono text-xs text-muted hover:border-red-500 hover:text-red-400">Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Omit<Project, "id" | "created_at" | "updated_at">;
  onSave: (data: Omit<Project, "id" | "created_at" | "updated_at">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);

  const set = (key: string, value: string | number | string[]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="rounded-sm border border-accent/30 bg-surface p-5 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" value={form.title} onChange={(v) => set("title", v)} />
        <Field label="Slug" value={form.slug} onChange={(v) => set("slug", v)} />
        <Field label="Category" value={form.category} onChange={(v) => set("category", v)} />
        <Field label="Number" value={form.number} onChange={(v) => set("number", v)} />
        <Field label="Status" value={form.status} onChange={(v) => set("status", v)} />
        <Field label="Order" value={String(form.order)} onChange={(v) => set("order", Number(v))} />
        <Field label="Tech (comma-sep)" value={form.tech.join(", ")} onChange={(v) => set("tech", v.split(",").map((s) => s.trim()).filter(Boolean))} />
      </div>
      <Field label="Description" value={form.description} onChange={(v) => set("description", v)} multiline />
      <div className="flex gap-3">
        <button onClick={() => onSave(form)} className="rounded-sm border border-accent bg-accent/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-accent hover:bg-accent/20">Save</button>
        <button onClick={onCancel} className="rounded-sm border border-line px-4 py-2 font-mono text-xs uppercase tracking-wider text-muted hover:text-foreground">Cancel</button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  const fieldId = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const cls = "w-full rounded-sm border border-line bg-background px-3 py-2 font-sans text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none";
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={fieldId} className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">{label}</label>
      {multiline ? (
        <textarea id={fieldId} value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={cls} />
      ) : (
        <input id={fieldId} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </div>
  );
}
