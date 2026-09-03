"use client";

import { createContext, useContext, useRef, useState, useEffect, useMemo, type ReactNode } from "react";

interface CursorState {
  /** Normalized -1 to 1 */
  x: number;
  y: number;
}

interface ScrollState {
  /** 0 = top of page, 1 = bottom */
  progress: number;
  /** Current scroll velocity (px/frame) */
  velocity: number;
  /** Active section id (if any) */
  section: string | null;
}

interface ThreeContextValue {
  cursor: CursorState;
  scroll: ScrollState;
  click: boolean;
  tier: "high" | "medium" | "low";
}

const ThreeContext = createContext<ThreeContextValue>({
  cursor: { x: 0, y: 0 },
  scroll: { progress: 0, velocity: 0, section: null },
  click: false,
  tier: "medium",
});

export function useThreeContext() {
  return useContext(ThreeContext);
}

const sections = ["about", "skills", "projects", "experience", "certifications", "writeups", "contact"];

export function ThreeProvider({ children, tier }: { children: ReactNode; tier: "high" | "medium" | "low" }) {
  const cursorRef = useRef({ x: 0, y: 0 });
  const [scroll, setScroll] = useState<ScrollState>({ progress: 0, velocity: 0, section: null });
  const clickRef = useRef(false);
  const [clickState, setClickState] = useState(false);
  const lastScrollY = useRef(0);
  const rafId = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const sectionEls = useRef<Map<string, Element>>(new Map());

  useEffect(() => {
    // Cache section elements once
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) sectionEls.current.set(id, el);
    }

    const onMouseMove = (e: MouseEvent) => {
      cursorRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    const onClick = () => {
      clickRef.current = true;
      setClickState(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        clickRef.current = false;
        setClickState(false);
      }, 100);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const y = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? y / maxScroll : 0;
        const velocity = y - lastScrollY.current;
        lastScrollY.current = y;

        let activeSection: string | null = null;
        for (const [id, el] of sectionEls.current) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= 0) {
            activeSection = id;
          }
        }

        setScroll({ progress, velocity, section: activeSection });
      });
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("click", onClick, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId.current);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  // Cursor is read from ref in useFrame (not via React state), avoiding re-renders.
  // Expose a reactive cursor via a throttled state update for non-R3F consumers.
  const [cursor, setCursor] = useState<CursorState>({ x: 0, y: 0 });
  useEffect(() => {
    let frameId = 0;
    const update = () => {
      setCursor({ x: cursorRef.current.x, y: cursorRef.current.y });
      frameId = requestAnimationFrame(update);
    };
    // Throttle to ~30fps for React consumers
    const interval = setInterval(() => {
      setCursor({ x: cursorRef.current.x, y: cursorRef.current.y });
    }, 33);
    return () => {
      cancelAnimationFrame(frameId);
      clearInterval(interval);
    };
  }, []);

  const value = useMemo(
    () => ({ cursor, scroll, click: clickState, tier }),
    [cursor, scroll, clickState, tier],
  );

  return (
    <ThreeContext.Provider value={value}>
      {children}
    </ThreeContext.Provider>
  );
}
