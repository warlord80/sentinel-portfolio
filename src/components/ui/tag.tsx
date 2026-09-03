import { cn } from "@/lib/cn";

type TagProps = {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "accent";
};

/**
 * Monospace, uppercase, hairline metadata chip.
 * Used for categories, dates and small metadata labels (PRD §50).
 */
export function Tag({ children, className, tone = "default" }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border border-line px-2 py-0.5 ",
        "font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted",
        tone === "accent" && "border-accent/40 text-accent",
        className,
      )}
    >
      {children}
    </span>
  );
}
