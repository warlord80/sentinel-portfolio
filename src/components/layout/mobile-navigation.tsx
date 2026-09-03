"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

const links = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Writeups", href: "#writeups" },
  { label: "Contact", href: "#contact" },
];

/**
 * Mobile navigation overlay — full-height menu panel that slides over the
 * content below the fixed top bar. Renders nothing on desktop widths.
 * Managed by the parent Navigation component via `open`.
 *
 * Includes keyboard focus trap and proper ARIA attributes.
 */
export function MobileNavigation({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<HTMLAnchorElement[]>([]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const focusable = linkRefs.current.filter(Boolean);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    // Move focus to first link on open
    requestAnimationFrame(() => {
      linkRefs.current[0]?.focus();
    });

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div
      ref={panelRef}
      className={cn(
        "fixed inset-0 top-16 z-30 flex flex-col bg-background px-6 pb-8 pt-4 md:hidden",
        "transition-all duration-300 ease-out",
        open
          ? "opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 -translate-y-2",
      )}
      role="navigation"
      aria-label="Mobile navigation"
      aria-hidden={!open}
    >
      {links.map((link, i) => (
        <a
          key={link.href}
          ref={(el) => { linkRefs.current[i] = el!; }}
          href={link.href}
          tabIndex={open ? 0 : -1}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(link.href);
          }}
          className={cn(
            "border-b border-line py-5 font-display text-3xl font-medium tracking-tight text-foreground",
            "transition-colors duration-150 hover:text-accent",
          )}
          style={{ transitionDelay: open ? `${i * 50}ms` : "0ms" }}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
