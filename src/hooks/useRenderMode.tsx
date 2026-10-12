import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * "webgl"    — hardware-accelerated WebGL is available: pages get the Three.js
 *              photo backgrounds.
 * "gradient" — no usable WebGL (blocked, disabled, or software-rendered because
 *              hardware acceleration is off): pages get the flat gradient themes.
 */
export type RenderMode = "webgl" | "gradient";

const STORAGE_KEY = "portfolio.render-mode";

// Software rasterisers — WebGL "works" on these but at a crawl, which is exactly
// the "hardware acceleration is off" situation the gradient themes exist for.
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software|basic render/i;

let cachedSupport: boolean | undefined;

/** True only when a hardware-accelerated WebGL context can be created. Cached. */
export function detectWebGL(): boolean {
  if (cachedSupport !== undefined) return cachedSupport;
  cachedSupport = false;
  try {
    const canvas = document.createElement("canvas");
    // failIfMajorPerformanceCaveat makes Chromium/Firefox refuse software-only contexts.
    const attrs: WebGLContextAttributes = { failIfMajorPerformanceCaveat: true };
    const gl = (canvas.getContext("webgl2", attrs) || canvas.getContext("webgl", attrs)) as WebGLRenderingContext | WebGL2RenderingContext | null;
    if (gl) {
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
      cachedSupport = !SOFTWARE_RENDERER.test(renderer);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  } catch {
    cachedSupport = false;
  }
  return cachedSupport;
}

/**
 * `?render=gradient` or `?render=webgl` forces a mode (remembered for the tab so it
 * survives client-side navigation); `?render=auto` clears the override.
 */
function initialMode(): RenderMode {
  try {
    const param = new URLSearchParams(window.location.search).get("render");
    if (param === "auto") sessionStorage.removeItem(STORAGE_KEY);
    else if (param === "gradient" || param === "webgl") sessionStorage.setItem(STORAGE_KEY, param);
    const forced = sessionStorage.getItem(STORAGE_KEY);
    if (forced === "gradient" || forced === "webgl") return forced;
  } catch {
    // storage / URL access can be blocked — fall through to detection
  }
  return detectWebGL() ? "webgl" : "gradient";
}

interface RenderModeValue {
  mode: RenderMode;
  /** Called by a scene when WebGL dies after detection said it was fine. */
  fallBackToGradient: (reason?: string) => void;
}

const RenderModeContext = createContext<RenderModeValue | null>(null);

export function RenderModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<RenderMode>(initialMode);

  const fallBackToGradient = useCallback((reason?: string) => {
    console.warn("Switching to gradient themes.", reason ?? "");
    setMode("gradient");
  }, []);

  const value = useMemo(() => ({ mode, fallBackToGradient }), [mode, fallBackToGradient]);
  return <RenderModeContext.Provider value={value}>{children}</RenderModeContext.Provider>;
}

export function useRenderMode(): RenderModeValue {
  const ctx = useContext(RenderModeContext);
  if (!ctx) throw new Error("useRenderMode must be used within a RenderModeProvider");
  return ctx;
}
