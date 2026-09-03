"use client";

import { type ReactNode, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { Navigation } from "@/components/layout/navigation";
import { ThreeProvider, detectTier, type Tier } from "@/components/three";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useRef } from "react";

// Dynamic imports with loading states for better perceived performance
const Scene = dynamic(
  () => import("@/components/three").then((mod) => mod.Scene),
  { ssr: false, loading: () => null },
);

const SmoothScroll = dynamic(
  () => import("@/components/motion").then((mod) => mod.SmoothScroll),
  { ssr: false },
);

/**
 * Detect WebGL availability using useSyncExternalStore to avoid hydration
 * mismatch. Server snapshot returns true (assume WebGL available), client
 * snapshot checks actual capability.
 */
function useWebGLAvailable(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => {
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
        return !!gl;
      } catch {
        return false;
      }
    },
    () => true,
  );
}

/**
 * Client-side shell — wraps the app with ThreeProvider (cursor/scroll state),
 * SmoothScroll (Lenis), Navigation, and the WebGL EnvironmentLayer.
 */
export function ClientShell({ children }: { children: ReactNode }) {
  const tierRef = useRef<Tier>(detectTier());
  const tier = tierRef.current;
  const webgl = useWebGLAvailable();

  return (
    <ErrorBoundary>
      <ThreeProvider tier={tier}>
        {webgl && <Scene />}
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
