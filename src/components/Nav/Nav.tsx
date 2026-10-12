import { useState } from "react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { useData } from "@/context/DataContext";
import { useRenderMode } from "@/hooks/useRenderMode";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import styles from "./Nav.module.scss";

export default function Nav() {
  const { info } = useData();
  const { mode } = useRenderMode();
  const [open, setOpen] = useState(false);

  const home = info.nav.find((item) => item.kind === "icon");
  // The landing page IS "home" — showing a home icon on it would be a link back to itself.
  const onLanding = useLocation().pathname === (home?.path ?? "/");
  // Everything else renders in the evenly-spaced pill — add or remove an
  // entry in info.nav (any kind other than "icon") and this list re-flows
  // with no other code changes.
  const items = info.nav.filter((item) => item.kind !== "icon");

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {mode === "gradient" ? (
          // Gradient mode has no logo at all — the theme toggle takes its slot instead.
          <ThemeToggle />
        ) : (
          !onLanding && (
            <RouterNavLink to={home?.path ?? "/"} className={styles.logo} aria-label={`${info.personal.name} — home`} onClick={() => setOpen(false)}>
              <HomeIcon />
            </RouterNavLink>
          )
        )}

        <nav className={[styles.links, open ? styles.open : ""].join(" ")} aria-label="Primary">
          {items.map((item) =>
            item.kind === "brand" ? (
              <span key={item.id} className={styles.brandPill} title={`${item.label} — coming soon`} aria-hidden="true">
                <img src="/logo.ico" alt="" width={20} height={20} />
              </span>
            ) : (
              <RouterNavLink
                key={item.id}
                to={item.path as string}
                className={({ isActive }) => [styles.link, isActive ? styles.active : ""].join(" ")}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </RouterNavLink>
            )
          )}
        </nav>

        <button
          type="button"
          className={styles.burger}
          aria-expanded={open}
          aria-label="Toggle navigation menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <g clip-path="url(#a)">
        <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="currentColor" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
