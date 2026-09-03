"use client";

import { type ReactNode, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Navigation } from "@/components/layout/navigation";
import { ThreeProvider } from "@/components/three/context";
import { detectTier, type Tier } from "@/components/three/performance";
import { ErrorBoundary } from "@/components/ui/error-boundary";

// Direct imports — avoids pulling Three.js into main bundle via barrel
const Scene = dynamic(
  () => import("@/components/three/scene").then((mod) => mod.Scene),
  { ssr: false, loading: () => null },
);

const SmoothScroll = dynamic(
  () => import("@/components/motion/smooth-scroll").then((mod) => mod.SmoothScroll),
  { ssr: false },
);

/** One-time capability detection, cached after first run */
let cachedCaps: { webgl: boolean; isMobile: boolean } | null = null;

function detectCapabilities(): { webgl: boolean; isMobile: boolean } {
  if (cachedCaps) return cachedCaps;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    const webgl = !!gl;
    const loseCtx = gl?.getExtension("WEBGL_lose_context");
    loseCtx?.loseContext();
    const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    ) || window.innerWidth < 768;
    cachedCaps = { webgl, isMobile };
  } catch {
    cachedCaps = { webgl: false, isMobile: true };
  }
  return cachedCaps;
}

/**
 * Client-side shell — wraps the app with ThreeProvider (cursor/scroll state),
 * SmoothScroll (Lenis), Navigation, and the WebGL EnvironmentLayer.
 *
 * Performance: Three.js scene is deferred until idle, and entirely skipped
 * on mobile devices where it provides no visual value but costs GPU resources.
 */
export function ClientShell({ children }: { children: ReactNode }) {
  const [tier] = useState<Tier>(() => detectTier());
  const [caps] = useState<{ webgl: boolean; isMobile: boolean }>(() =>
    typeof window !== "undefined" ? detectCapabilities() : { webgl: true, isMobile: false },
  );
  const [mountScene, setMountScene] = useState(false);

  // Defer scene mount until browser is idle
  useEffect(() => {
    if (typeof window === "undefined") return;
    const idleCallback = window.requestIdleCallback(() => setMountScene(true), { timeout: 3000 });
    return () => window.cancelIdleCallback(idleCallback);
  }, []);

  const showScene = caps.webgl && !caps.isMobile && mountScene;

  return (
    <ErrorBoundary>
      <ThreeProvider tier={tier}>
        {showScene && <Scene />}
        <Navigation />
        <SmoothScroll>
          <main id="main-content" className="flex-1">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:border focus:border-accent focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:text-accent"
            >
              Skip to main content
            </a>
            {children}
          </main>
        </SmoothScroll>
      </ThreeProvider>
    </ErrorBoundary>
  );
}
