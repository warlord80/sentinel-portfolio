/**
 * Minimal class-name combiner. Filters falsy values and joins with spaces.
 * (Intentionally dependency-free — see PRD §50 reusable primitives.)
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
