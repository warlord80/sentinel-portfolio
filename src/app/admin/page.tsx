import { getAllProjects } from "@/app/actions/content";
import { getExperience } from "@/app/actions/content";
import { getCertifications } from "@/app/actions/content";
import { getWriteups } from "@/app/actions/content";
import { getContactSubmissions, getAnalytics } from "@/app/actions/admin";

export default async function AdminDashboard() {
  const [projects, experience, certifications, writeups, submissions, analytics] =
    await Promise.all([
      getAllProjects(),
      getExperience(),
      getCertifications(),
      getWriteups(),
      getContactSubmissions(),
      getAnalytics(),
    ]);

  const pending = submissions.filter((s) => s.status === "pending").length;

  const stats = [
    { label: "Projects", count: projects.length, href: "/admin/projects" },
    { label: "Experience", count: experience.length, href: "/admin/experience" },
    { label: "Certifications", count: certifications.length, href: "/admin/certifications" },
    { label: "Writeups", count: writeups.length, href: "/admin/writeups" },
    { label: "Submissions", count: submissions.length, href: "/admin/submissions", badge: pending > 0 ? pending : null },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-medium text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 font-sans text-sm text-muted">
          Manage your portfolio content.
        </p>
      </div>

      {/* Analytics overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-sm border border-line bg-surface/50 p-5">
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted">
            Total Views
          </span>
          <p className="mt-3 font-display text-3xl font-medium text-foreground">
            {analytics.total.toLocaleString()}
          </p>
        </div>
        <div className="rounded-sm border border-line bg-surface/50 p-5">
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted">
            Today
          </span>
          <p className="mt-3 font-display text-3xl font-medium text-accent">
            {analytics.today.toLocaleString()}
          </p>
        </div>
        <div className="rounded-sm border border-line bg-surface/50 p-5">
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted">
            Pending Submissions
          </span>
          <p className="mt-3 font-display text-3xl font-medium text-foreground">
            {pending}
          </p>
        </div>
      </div>

      {/* Popular sections */}
      {analytics.sections.length > 0 && (
        <div className="rounded-sm border border-line bg-surface/50 p-5">
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted">
            Popular Sections
          </span>
          <div className="mt-4 space-y-2">
            {analytics.sections.map((s) => (
              <div key={s.section} className="flex items-center justify-between">
                <span className="font-sans text-sm text-foreground capitalize">{s.section}</span>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full bg-accent/60"
                      style={{ width: `${Math.min(100, (s.count / analytics.sections[0].count) * 100)}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-muted w-8 text-right">{s.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content sections */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <a
            key={s.label}
            href={s.href}
            className="group rounded-sm border border-line bg-surface/50 p-5 transition-colors hover:border-accent"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted">
                {s.label}
              </span>
              {s.badge !== null && s.badge !== undefined && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 font-mono text-[10px] font-medium text-background">
                  {s.badge}
                </span>
              )}
            </div>
            <p className="mt-3 font-display text-3xl font-medium text-foreground">
              {s.count}
            </p>
          </a>
        ))}
      </div>

      {/* Quick links */}
      <div className="flex flex-wrap gap-3">
        <a href="/admin/social" className="rounded-sm border border-line bg-surface/50 px-4 py-2 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent">
          Social Links
        </a>
        <a href="/admin/settings" className="rounded-sm border border-line bg-surface/50 px-4 py-2 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent">
          Settings & Resume
        </a>
      </div>
    </div>
  );
}
