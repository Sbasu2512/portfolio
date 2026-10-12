import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { GradientThemeId } from "@/theme/gradientThemes";

const STORAGE_KEY = "portfolio.gradient-theme";

/** The person's choice persists across visits (unlike render-mode's per-tab override) — a
 *  light/dark preference is exactly the kind of thing a returning visitor expects to stick. */
function initial(): GradientThemeId {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;
  } catch {
    // localStorage can be blocked (private mode, permissions) — fall back to the default below
  }
  return "dark";
}

interface GradientThemeValue {
  themeId: GradientThemeId;
  toggle: () => void;
  setTheme: (id: GradientThemeId) => void;
}

const Ctx = createContext<GradientThemeValue | null>(null);

/**
 * Which of the two gradient themes (see theme/gradientThemes.ts) the gradient-mode pages use.
 * Only meaningful when render mode is "gradient" — WebGL pages ignore this entirely.
 */
export function GradientThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<GradientThemeId>(initial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, themeId);
    } catch {
      // best-effort persistence only
    }
  }, [themeId]);

  const setTheme = useCallback((id: GradientThemeId) => setThemeId(id), []);
  const toggle = useCallback(() => setThemeId((t) => (t === "dark" ? "light" : "dark")), []);
  const value = useMemo(() => ({ themeId, toggle, setTheme }), [themeId, toggle, setTheme]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGradientTheme(): GradientThemeValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useGradientTheme must be used within a GradientThemeProvider");
  return ctx;
}
