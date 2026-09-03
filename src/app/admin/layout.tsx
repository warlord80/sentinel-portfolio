"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/cn";

const nav = [
  { label: "Dashboard", href: "/admin" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Experience", href: "/admin/experience" },
  { label: "Certifications", href: "/admin/certifications" },
  { label: "Writeups", href: "/admin/writeups" },
  { label: "Submissions", href: "/admin/submissions" },
  { label: "Social Links", href: "/admin/social" },
  { label: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Login page — no sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-56 flex-col border-r border-line bg-surface/50 transition-transform duration-200",
          "md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-line px-4">
          <Link
            href="/admin"
            className="font-display text-lg font-medium text-foreground"
          >
            Sentinel<span className="text-accent">.</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-sm text-muted hover:text-foreground md:hidden"
            aria-label="Close sidebar"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
              <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "block rounded-sm px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] transition-colors",
                  active
                    ? "bg-accent/10 text-accent"
                    : "text-muted hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-line p-3">
          <Link
            href="/"
            target="_blank"
            className="block rounded-sm px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-muted hover:text-foreground"
          >
            View Site ↗
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full rounded-sm px-3 py-2 text-left font-mono text-xs uppercase tracking-[0.12em] text-muted hover:text-red-400"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header with hamburger */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center border-b border-line bg-surface/50 px-4 md:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-sm text-foreground"
          aria-label="Open sidebar"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
            <path d="M2 4h12M2 8h12M2 12h12" strokeLinecap="round" />
          </svg>
        </button>
        <Link
          href="/admin"
          className="ml-3 font-display text-lg font-medium text-foreground"
        >
          Sentinel<span className="text-accent">.</span>
        </Link>
      </div>

      {/* Main content */}
      <main className="flex-1 p-4 pt-18 md:ml-56 md:p-8 md:pt-8">{children}</main>
    </div>
  );
}
