import { getAllProjects } from "@/app/actions/content";
import { getExperience } from "@/app/actions/content";
import { getCertifications } from "@/app/actions/content";
import { getWriteups } from "@/app/actions/content";
import { getContactSubmissions } from "@/app/actions/admin";

export default async function AdminDashboard() {
  const [projects, experience, certifications, writeups, submissions] =
    await Promise.all([
      getAllProjects(),
      getExperience(),
      getCertifications(),
      getWriteups(),
      getContactSubmissions(),
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
    </div>
  );
}
