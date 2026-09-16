"use client";

import { createContext, useContext, type ReactNode } from "react";

interface ThreeContextValue {
  tier: "high" | "medium" | "low";
}

const ThreeContext = createContext<ThreeContextValue>({
  tier: "medium",
});

export function useThreeContext() {
  return useContext(ThreeContext);
}

/**
 * ThreeProvider — minimal context for tier detection only.
 * Cursor/scroll state removed — particles don't need it.
 */
export function ThreeProvider({ children, tier }: { children: ReactNode; tier: "high" | "medium" | "low" }) {
  return (
    <ThreeContext.Provider value={{ tier }}>
      {children}
    </ThreeContext.Provider>
  );
}
