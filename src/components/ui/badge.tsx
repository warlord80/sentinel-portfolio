import { cn } from "@/lib/cn";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "accent";
};

/**
 * Small geometric status/metadata marker (mono, uppercase).
 * Distinct from Tag by the filled surface treatment.
 */
export function Badge({ children, className, tone = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm bg-surface px-2 py-0.5 ",
        "font-mono text-[0.625rem] uppercase tracking-[0.12em] text-foreground/80",
        tone === "accent" && "text-accent",
        className,
      )}
    >
      {children}
    </span>
  );
}
