"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="font-display text-2xl font-medium text-foreground">
            Sentinel<span className="text-accent">.</span>
          </h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-muted">
            Admin Access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-mono text-xs uppercase tracking-[0.18em] text-muted"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="h-10 rounded-sm border border-line bg-surface px-3 font-sans text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="font-mono text-xs uppercase tracking-[0.18em] text-muted"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-10 rounded-sm border border-line bg-surface px-3 font-sans text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="font-sans text-sm text-red-400" role="alert" aria-live="assertive">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-10 w-full rounded-sm border border-line bg-surface font-sans text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
