/**
 * The two gradient themes used when WebGL isn't available (see hooks/useRenderMode.tsx).
 * Unlike the old per-page Figma gradients this replaced, the same theme applies to every page —
 * the person picks one with the toggle button that replaces the nav logo in gradient mode
 * (components/Nav/Nav.tsx), and it persists across visits (hooks/useGradientTheme.tsx).
 *
 * Layout — card width, heading alignment, pill sizing — stays per-page and lives in
 * theme/pageThemes.ts; PageShell merges that with whichever of these two is active.
 */
export type GradientThemeId = "dark" | "light";

export interface GradientTheme {
  label: string;
  /** Page background. */
  gradient: string;
  /** CSS custom properties applied to the page root. */
  vars: Record<string, string>;
}

export const GRADIENT_THEMES: Record<GradientThemeId, GradientTheme> = {
  dark: {
    label: "Dark",
    gradient: "linear-gradient(180deg, #152331 0%, #000000 100%)",
    vars: {
      "--th-ink": "#ffffff",
      "--th-ink-dim": "rgba(255, 255, 255, 0.75)",
      "--th-accent-2": "#ffd479",
      "--th-year": "rgba(255, 255, 255, 0.85)",
      "--th-nav-ink": "#ffffff",
      "--th-nav-ink-dim": "rgba(255, 255, 255, 0.72)",
      "--th-footer-ink": "#ffffff",
      "--th-card-bg": "rgba(255, 255, 255, 0.06)",
      "--th-card-edge": "rgba(255, 255, 255, 0.18)",
      "--th-chrome-bg": "rgba(255, 255, 255, 0.07)",
      "--th-chrome-edge": "rgba(255, 255, 255, 0.22)",
      "--th-fade-to": "rgba(0, 0, 0, 0.85)",
      "--th-heading-shadow": "0 4px 30px rgba(0, 0, 0, 0.7)",
    },
  },
  light: {
    label: "Light",
    gradient: "linear-gradient(180deg, #fc5c7d 0%, #6a82fb 100%)",
    vars: {
      "--th-ink": "#14101f",
      "--th-ink-dim": "rgba(20, 16, 31, 0.86)",
      "--th-accent-2": "#33206b",
      "--th-year": "rgba(20, 16, 31, 0.8)",
      "--th-nav-ink": "#14101f",
      "--th-nav-ink-dim": "rgba(20, 16, 31, 0.84)",
      "--th-footer-ink": "#14101f",
      "--th-card-bg": "rgba(255, 255, 255, 0.30)",
      "--th-card-edge": "rgba(20, 16, 31, 0.25)",
      "--th-chrome-bg": "rgba(255, 255, 255, 0.34)",
      "--th-chrome-edge": "rgba(20, 16, 31, 0.28)",
      "--th-fade-to": "rgba(106, 130, 251, 0.85)",
      // dark text: a light halo instead of a dark drop-shadow
      "--th-heading-shadow": "0 2px 18px rgba(255, 255, 255, 0.45)",
    },
  },
};
