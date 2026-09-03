import { forwardRef } from "react";
import { cn } from "@/lib/cn";

const inputBase =
  "w-full bg-transparent border-b font-sans text-base text-foreground " +
  "placeholder:text-muted/60 " +
  "border-b-line-strong focus:border-b-accent focus:outline-none " +
  "transition-colors duration-200 ease-out";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/** Underline-only text input (soft brutalism form rule). */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(inputBase, "py-2", className)} {...props} />
  ),
);
Input.displayName = "Input";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

/** Underline-only textarea (soft brutalism form rule). */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(inputBase, "py-2 min-h-[120px] resize-y", className)}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

/** Underline-only select (soft brutalism form rule). */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(inputBase, "py-2 appearance-none", className)}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";
