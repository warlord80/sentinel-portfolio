"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { useLenis } from "@/components/motion";

const links = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Writeups", href: "/#writeups" },
  { label: "Contact", href: "/#contact" },
];

/**
 * Sticky top bar — single chrome element. Transparent background. Hides on
 * scroll down, reveals on scroll up. Left: wordmark. Right: desktop anchor
 * links and a mobile menu toggle. The mobile overlay is rendered here so the
 * bar and panel stay visually/behaviorally coupled.
 */
export function Navigation() {
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lenisRef = useLenis();
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        setHidden(y > lastY && y > 96);
        setAtTop(y < 8);
        lastY = y;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = useCallback(
    (href: string) => {
      setMobileOpen(false);
      // Extract the hash from the href (e.g. "/#about" → "#about")
      const hash = href.includes("#") ? href.slice(href.indexOf("#")) : null;

      if (!isHome && hash) {
        // On a detail page — navigate to homepage with hash
        router.push(href);
        return;
      }

      if (hash) {
        const lenis = lenisRef?.current;
        if (lenis) {
          lenis.scrollTo(hash, { offset: -64 });
        } else {
          const el = document.querySelector(hash);
          el?.scrollIntoView({ behavior: "smooth" });
        }
      }
    },
    [lenisRef, isHome, router],
  );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 border-b border-transparent transition-all duration-300 ease-out",
          hidden ? "-translate-y-full" : "translate-y-0",
          !atTop && "border-line bg-background/70 backdrop-blur-sm",
        )}
      >
        <nav
          className="mx-auto flex h-14 max-w-[var(--max-w)] items-center justify-between px-6 sm:h-16"
          aria-label="Primary"
        >
          <Link
            href="/#top"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("/#top");
            }}
            className="font-display text-base font-medium tracking-tight shrink-0"
          >
            NWOZOR<span className="text-accent">.</span>
          </Link>

          <ul className="hidden items-center gap-7 md:flex shrink-0">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(link.href);
                  }}
                  className="font-mono text-[0.75rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile toggle */}
          <button
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 text-foreground md:hidden"
          >
            <span
              className={cn(
                "h-px w-5 bg-current transition-transform duration-200",
                mobileOpen && "translate-y-[7px] rotate-45",
              )}
            />
            <span className={cn("h-px w-5 bg-current", mobileOpen && "opacity-0")} />
            <span
              className={cn(
                "h-px w-5 bg-current transition-transform duration-200",
                mobileOpen && "-translate-y-[7px] -rotate-45",
              )}
            />
          </button>
        </nav>
      </header>

      <MobileNavigation
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onNavigate={scrollTo}
        isHome={isHome}
      />
    </>
  );
}
