import { useEffect, useMemo, type CSSProperties, type ReactNode } from "react";
import Nav from "@/components/Nav/Nav";
import Footer from "@/components/Footer/Footer";
import SoundToggle from "@/components/SoundToggle/SoundToggle";
import GradientBackground from "@/components/GradientBackground/GradientBackground";
import { useAudio } from "@/context/AudioContext";
import { useRenderMode } from "@/hooks/useRenderMode";
import { PAGE_LAYOUT, type PageThemeId } from "@/theme/pageThemes";
import { GRADIENT_THEMES } from "@/theme/gradientThemes";
import { useGradientTheme } from "@/hooks/useGradientTheme";
import type { SceneKey } from "@/audio/soundscapes";
import styles from "./PageShell.module.scss";

interface Props {
  /** Three.js background, used when WebGL is available. */
  scene: ReactNode;
  sceneKey: SceneKey;
  /** Which page this is — decides gradient-mode layout (card width, heading alignment, pill sizing). */
  theme: PageThemeId;
  children: ReactNode;
  bare?: boolean; // true = no nav/footer chrome (landing page draws its own)
  /**
   * "full" darkens the whole scene (the black-hole landing page).
   * "edge" only darkens the strips behind the nav and footer, so photo pages
   * show the photograph untouched everywhere else.
   */
  scrim?: "full" | "edge";
}

export default function PageShell({ scene, sceneKey, theme, children, bare, scrim = "full" }: Props) {
  const { setScene, enabled, disable } = useAudio();
  const { mode } = useRenderMode();
  const gradient = mode === "gradient";
  const { themeId: gradientThemeId } = useGradientTheme();
  const activeGradient = GRADIENT_THEMES[gradientThemeId];
  useEffect(() => setScene(sceneKey), [sceneKey, setScene]);
  // No background music in gradient mode — only the WebGL pages carry a soundscape. If WebGL
  // fails mid-session and the app drops to gradients, stop whatever was already playing.
  useEffect(() => {
    if (gradient && enabled) disable();
  }, [gradient, enabled, disable]);
  // Layout (per page) + colour (the person's dark/light pick, the same for every page).
  const vars = useMemo<CSSProperties>(
    () => ({ ...PAGE_LAYOUT[theme].vars, ...activeGradient.vars }) as CSSProperties,
    [theme, activeGradient]
  );

  return (
    <div
      className={styles.page}
      data-mode={mode}
      data-theme={theme}
      data-gtheme={gradient ? gradientThemeId : undefined}
      style={gradient ? vars : undefined}
    >
      <div className={styles.sceneLayer}>{gradient ? <GradientBackground gradient={activeGradient.gradient} /> : scene}</div>
      {!gradient && <div className={scrim === "edge" ? styles.edgeScrim : styles.scrim} />}
      {!bare && <Nav />}
      <main className={styles.content}>{children}</main>
      {!bare && <Footer />}
      {!gradient && <SoundToggle />}
    </div>
  );
}
