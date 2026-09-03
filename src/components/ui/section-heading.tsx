import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  index?: string;
  title: React.ReactNode;
  eyebrow?: string;
  className?: string;
  as?: "h2" | "h3";
  id?: string;
};

/**
 * Editorial section heading: optional mono eyebrow (index), display title.
 * H2 style per spec: clamp(2rem, 4vw, 3.5rem), lh 1.1, tracking -0.01em.
 */
export function SectionHeading({
  index,
  title,
  eyebrow,
  className,
  as: Tag = "h2",
  id,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {(eyebrow || index) && (
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
          {index && <span className="text-accent">{index}</span>}
          {eyebrow && <span className="h-px w-8 bg-line" aria-hidden="true" />}
          {eyebrow && <span>{eyebrow}</span>}
        </p>
      )}
      <Tag
        id={id}
        className="font-display text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[1.1] tracking-[-0.01em] text-foreground"
      >
        {title}
      </Tag>
    </div>
  );
}
