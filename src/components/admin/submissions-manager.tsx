"use client";

import { useState } from "react";
import { getContactSubmissions, updateSubmissionStatus, deleteSubmission } from "@/app/actions/admin";

interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "pending" | "read" | "archived";
  created_at: string;
}

export function SubmissionsManager({ items: initial }: { items: Submission[] }) {
  const [items, setItems] = useState(initial);
  const [msg, setMsg] = useState("");

  const handleStatus = async (id: string, status: "pending" | "read" | "archived") => {
    const { error } = await updateSubmissionStatus(id, status);
    if (error) { setMsg(error); return; }
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await deleteSubmission(id);
    if (error) { setMsg(error); return; }
    setItems((prev) => prev.filter((s) => s.id !== id));
  };

  const statusColor = (s: string) => {
    if (s === "pending") return "text-yellow-400";
    if (s === "read") return "text-accent";
    return "text-muted";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-foreground">Submissions</h1>
        <p className="mt-1 font-sans text-sm text-muted">{items.length} submissions</p>
      </div>
      {msg && <p className="font-sans text-sm text-accent" role="status" aria-live="polite">{msg}</p>}
      <div className="space-y-2">
        {items.map((s) => (
          <div key={s.id} className="rounded-sm border border-line bg-surface/50 p-4 transition-colors hover:border-accent/50">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-sans text-sm font-medium text-foreground">{s.name} <span className="text-muted">·</span> <span className="font-mono text-xs text-muted">{s.email}</span></p>
                <p className="mt-1 font-mono text-xs text-muted">{new Date(s.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-mono text-xs uppercase ${statusColor(s.status)}`}>{s.status}</span>
                <select
                  value={s.status}
                  onChange={(e) => handleStatus(s.id, e.target.value as "pending" | "read" | "archived")}
                  aria-label={`Status for submission from ${s.name}`}
                  className="rounded-sm border border-line bg-background px-3 py-2 font-mono text-xs text-foreground focus:border-accent focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="read">Read</option>
                  <option value="archived">Archived</option>
                </select>
                <button onClick={() => handleDelete(s.id)} aria-label={`Delete submission from ${s.name}`} className="rounded-sm border border-line px-4 py-2 font-mono text-xs text-muted hover:border-red-500 hover:text-red-400">Del</button>
              </div>
            </div>
            <p className="mt-3 font-sans text-sm text-muted/80">{s.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
