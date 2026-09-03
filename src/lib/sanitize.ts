/**
 * Input sanitization utilities for XSS prevention.
 */

const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
};

/**
 * Escape HTML special characters to prevent XSS.
 */
export function escapeHtml(input: string): string {
  return input.replace(/[&<>"'/]/g, (char) => HTML_ESCAPE_MAP[char] ?? char);
}

/**
 * Sanitize a string: trim, escape HTML, enforce max length.
 */
export function sanitizeString(input: string, maxLength = 2000): string {
  return escapeHtml(input.trim()).slice(0, maxLength);
}

/**
 * Sanitize an email: basic format check, lowercase, trim.
 */
export function sanitizeEmail(input: string): string {
  const email = input.trim().toLowerCase();
  // Basic email regex — not exhaustive, but blocks obvious XSS
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "";
  return email.slice(0, 254);
}

/**
 * Sanitize an array of strings (e.g. tech tags).
 */
export function sanitizeArray(input: string[], maxItems = 20, maxLength = 50): string[] {
  return input
    .map((s) => escapeHtml(s.trim()).slice(0, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}
