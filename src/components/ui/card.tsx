import { cn } from "@/lib/cn";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
};

/**
 * Structural surface panel. Soft brutalism: hairline border, tight radius,
 * no drop shadows (PRD §2). `interactive` adds a brass-border hover.
 */
export function Card({ children, className, interactive = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-line bg-surface/40 p-6",
        interactive &&
          "transition-colors duration-200 ease-out hover:border-accent/50",
        className,
      )}
    >
      {children}
    </div>
  );
}
