import { cn } from "@/lib/cn";

type ToastProps = {
  children: React.ReactNode;
  tone?: "default" | "accent" | "error";
  className?: string;
  role?: "status" | "alert";
};

/**
 * Lightweight status toast. Structural only — enter/exit animation is a
 * Phase 3 (motion) concern.
 */
export function Toast({
  children,
  tone = "default",
  className,
  role = "status",
}: ToastProps) {
  return (
    <div
      role={role}
      className={cn(
        "rounded-md border border-line bg-surface px-4 py-3 text-sm text-foreground",
        tone === "accent" && "border-accent/50",
        tone === "error" && "border-red-500/50 text-red-300",
        className,
      )}
    >
      {children}
    </div>
  );
}
