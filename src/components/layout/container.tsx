import { cn } from "@/lib/cn";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Shared fluid container that caps content at the centralized `--max-w`
 * design token and applies the standard horizontal gutter. Sourcing the
 * max width from the token (rather than a per-section hardcode) keeps the
 * layout re-themable without rewriting components (PRD §52).
 */
export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[var(--max-w)] px-6", className)}
    >
      {children}
    </div>
  );
}
