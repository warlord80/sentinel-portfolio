import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm border font-sans font-medium " +
  "transition-all duration-200 ease-out " +
  "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-3 " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "min-h-[44px]";

const variants: Record<Variant, string> = {
  // Muted gold background, near-black text, gold glow; hover → brighten + lift
  primary:
    "bg-[#B08D45] border border-[#B08D45] text-[#0f1014] font-semibold " +
    "shadow-[0_0_12px_rgba(176,141,69,0.25)] " +
    "hover:bg-[#c5a059] hover:border-[#c5a059] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(197,160,89,0.35)] " +
    "active:translate-y-0 active:shadow-[0_0_8px_rgba(176,141,69,0.2)]",
  // Near-black bg, thin gold-tinted border, light text; hover → gold border + tint
  secondary:
    "bg-transparent border border-line text-foreground/80 " +
    "hover:border-accent/60 hover:text-accent hover:bg-accent/5",
  ghost:
    "bg-transparent border border-line text-foreground/70 hover:text-accent",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;
type ButtonAsAnchor = CommonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const classes = cn(base, variants[variant], sizes[size], className);

    if ("href" in props && props.href !== undefined) {
      const { href, ...rest } = props as ButtonAsAnchor;
      return (
        <a href={href} className={classes} {...rest}>
          {children}
        </a>
      );
    }

    return (
      <button ref={ref} className={classes} {...(props as ButtonAsButton)}>
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
