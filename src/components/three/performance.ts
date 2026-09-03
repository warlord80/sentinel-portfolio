

let cachedTier: Tier | null = null;

/**
 * Performance tiers — detect device capability and return a quality level
 * that controls geometry complexity, post-processing, and animation frame
 * budget. The monolith's LOD and effects scale with this.
 *
 * Result is cached after first call to avoid creating WebGL contexts on
 * every render.
 */
export type Tier = "high" | "medium" | "low";

export function detectTier(): Tier {
  if (cachedTier) return cachedTier;
  if (typeof window === "undefined") return "medium";

  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl2") ?? canvas.getContext("webgl");
  if (!gl) {
    cachedTier = "low";
    return cachedTier;
  }

  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = debugInfo
    ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    : "";

  const lowPatterns = /swiftshader|llvmpipe|softpipe|mesa|intel|adreno 3|adreno 4|mali-4|mali-t6/i;
  const highPatterns = /nvidia|rtx|gtx|radeon|rx|apple m/i;

  if (lowPatterns.test(renderer)) {
    cachedTier = "low";
  } else if (highPatterns.test(renderer)) {
    cachedTier = "high";
  } else {
    // Check device memory (Chrome only)
    const nav = navigator as unknown as Record<string, unknown>;
    const mem = nav.deviceMemory;
    if (typeof mem === "number" && mem < 4) {
      cachedTier = "low";
    } else {
      cachedTier = "medium";
    }
  }

  // Clean up the temporary WebGL context
  const loseCtx = gl.getExtension("WEBGL_lose_context");
  loseCtx?.loseContext();

  return cachedTier;
}

/** Monolith extrude detail level per tier */
export function monolithDetail(tier: Tier): number {
  switch (tier) {
    case "high":
      return 6;
    case "medium":
      return 4;
    case "low":
      return 2;
  }
}

/** Whether to enable post-processing (bloom, vignette) */
export function postProcessingEnabled(tier: Tier): boolean {
  return tier !== "low";
}
