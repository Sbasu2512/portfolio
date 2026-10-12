import { useGradientTheme } from "@/hooks/useGradientTheme";
import styles from "./ThemeToggle.module.scss";

/**
 * Gradient-mode-only. Sits in the nav where the home logo would otherwise be (see Nav.tsx,
 * which never renders both) and switches between the two gradient themes in
 * theme/gradientThemes.ts. The icon shown is the theme currently active.
 */
export default function ThemeToggle() {
  const { themeId, toggle } = useGradientTheme();
  const isDark = themeId === "dark";

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Dark theme — switch to light" : "Light theme — switch to dark"}
    >
      {isDark ? <MoonIcon /> : <SunIcon /> }
    </button>
  );
}

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v3M12 18.5v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2.5 12h3M18.5 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.3 14.9A8.4 8.4 0 0 1 9.1 3.7a8.9 8.9 0 1 0 11.2 11.2Z" />
    </svg>
  );
}
