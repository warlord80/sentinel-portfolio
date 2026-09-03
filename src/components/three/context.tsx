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

interface DeviceMotionState {
  /** Tilt X (-1 to 1) */
  tiltX: number;
  /** Tilt Y (-1 to 1) */
  tiltY: number;
  /** Whether device motion is active */
  enabled: boolean;
}

interface ThreeContextValue {
  cursor: CursorState;
  scroll: ScrollState;
  click: boolean;
  tier: "high" | "medium" | "low";
  deviceMotion: DeviceMotionState;
  requestMotionPermission: () => void;
}

const ThreeContext = createContext<ThreeContextValue>({
  cursor: { x: 0, y: 0 },
  scroll: { progress: 0, velocity: 0, section: null },
  click: false,
  tier: "medium",
  deviceMotion: { tiltX: 0, tiltY: 0, enabled: false },
  requestMotionPermission: () => {},
});

export function useThreeContext() {
  return useContext(ThreeContext);
}

const sections = ["about", "skills", "projects", "experience", "certifications", "writeups", "contact"];

/**
 * ThreeProvider — manages cursor, scroll, click, and device motion state.
 *
 * R3F components read from refs (no re-renders).
 * React DOM consumers get throttled state updates (~10fps).
 */
export function ThreeProvider({ children, tier }: { children: ReactNode; tier: "high" | "medium" | "low" }) {
  const cursorRef = useRef({ x: 0, y: 0 });
  const clickRef = useRef(false);
  const lastScrollY = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const sectionEls = useRef<Map<string, Element>>(new Map());
  const motionRef = useRef({ tiltX: 0, tiltY: 0 });
  const motionEnabledRef = useRef(false);

  // Throttled cursor state for React DOM consumers only (~10fps)
  const [cursor, setCursor] = useState<CursorState>({ x: 0, y: 0 });
  // Throttled scroll state for React DOM consumers
  const [scroll, setScroll] = useState<ScrollState>({ progress: 0, velocity: 0, section: null });
  const [clickState, setClickState] = useState(false);
  const [deviceMotion, setDeviceMotion] = useState<DeviceMotionState>({
    tiltX: 0, tiltY: 0, enabled: false,
  });

  useEffect(() => {
    // Cache section elements once
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) sectionEls.current.set(id, el);
    }

    let cursorRafId = 0;
    let scrollRafId = 0;
    let motionRafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      cursorRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
      // Throttle cursor state updates to ~10fps for React DOM
      if (!cursorRafId) {
        cursorRafId = requestAnimationFrame(() => {
          setCursor({ x: cursorRef.current.x, y: cursorRef.current.y });
          cursorRafId = 0;
        });
      }
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
      if (scrollRafId) return;
      scrollRafId = requestAnimationFrame(() => {
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
        scrollRafId = 0;
      });
    };

    const onDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (!motionEnabledRef.current) return;
      if (motionRafId) return;
      motionRafId = requestAnimationFrame(() => {
        // Gamma: left/right tilt (-90 to 90), Beta: front/back tilt (-180 to 180)
        const tiltX = Math.max(-1, Math.min(1, (e.gamma ?? 0) / 45));
        const tiltY = Math.max(-1, Math.min(1, ((e.beta ?? 0) - 45) / 45));
        motionRef.current = { tiltX, tiltY };
        setDeviceMotion({ tiltX, tiltY, enabled: true });
        motionRafId = 0;
      });
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("click", onClick, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("deviceorientation", onDeviceOrientation, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("deviceorientation", onDeviceOrientation);
      cancelAnimationFrame(cursorRafId);
      cancelAnimationFrame(scrollRafId);
      cancelAnimationFrame(motionRafId);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const requestMotionPermission = useMemo(() => {
    return () => {
      if (typeof DeviceOrientationEvent !== "undefined" &&
          typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === "function") {
        (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission()
          .then((state: string) => {
            if (state === "granted") {
              motionEnabledRef.current = true;
            }
          })
          .catch(() => {});
      } else if (typeof DeviceOrientationEvent !== "undefined") {
        // Non-iOS: no permission needed
        motionEnabledRef.current = true;
      }
    };
  }, []);

  const value = useMemo(
    () => ({ cursor, scroll, click: clickState, tier, deviceMotion, requestMotionPermission }),
    [cursor, scroll, clickState, tier, deviceMotion, requestMotionPermission],
  );

  return (
    <ThreeContext.Provider value={value}>
      {children}
    </ThreeContext.Provider>
  );
}
