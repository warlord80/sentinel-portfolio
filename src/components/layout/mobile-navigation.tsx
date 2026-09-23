"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const links = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Writeups", href: "/#writeups" },
  { label: "Contact", href: "/#contact" },
];

/**
 * Mobile navigation overlay — full-height menu panel that slides over the
 * content below the fixed top bar. Renders nothing on desktop widths.
 * Managed by the parent Navigation component via `open`.
 *
 * Includes keyboard focus trap, proper ARIA attributes, and active section detection.
 */
export function MobileNavigation({
  open,
  onClose,
  onNavigate,
  isHome,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
  isHome: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<HTMLAnchorElement[]>([]);
  const [activeSection, setActiveSection] = useState("");

  // Track which section is in view (only on homepage)
  useEffect(() => {
    if (!open || !isHome) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.3 },
    );

    links.forEach((link) => {
      const hash = link.href.slice(link.href.indexOf("#"));
      const el = document.querySelector(hash);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [open, isHome]);

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
        "fixed inset-0 top-16 z-30 flex flex-col bg-background/98 backdrop-blur-sm px-8 pb-8 pt-6 md:hidden",
        "transition-all duration-300 ease-out",
        open
          ? "opacity-100 translate-y-0"
          : "pointer-events-none opacity-0 -translate-y-2",
      )}
      role="navigation"
      aria-label="Mobile navigation"
      aria-hidden={!open}
    >
      {links.map((link, i) => {
        const hash = link.href.slice(link.href.indexOf("#"));
        const isActive = isHome && activeSection === hash;
        return (
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
              "border-b border-line/50 py-6 font-display text-2xl font-medium tracking-tight sm:text-3xl",
              "transition-all duration-200",
              isActive
                ? "text-accent border-accent/30"
                : "text-foreground/80 hover:text-accent hover:border-accent/20",
            )}
            style={{ transitionDelay: open ? `${i * 50}ms` : "0ms" }}
          >
            {isActive && (
              <span className="mr-3 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
            )}
            {link.label}
          </a>
        );
      })}
    </div>
  );
}
