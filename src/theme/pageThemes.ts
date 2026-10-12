import type { CSSProperties } from "react";

/**
 * Per-page LAYOUT for gradient mode — card width, heading alignment, pill sizing. Colour (the
 * gradient itself, ink, glass tint) is not here any more: it comes from whichever entry of
 * theme/gradientThemes.ts the person has picked, the same for every page. PageShell merges the
 * two, layout first so the active colour theme's variables always win if a name ever collides.
 */
export type PageThemeId = "home" | "about" | "work" | "education" | "projects" | "skills";

export interface PageLayout {
  vars: Record<string, string>;
}

const base = {
  "--th-heading-size": "clamp(44px, 6.7vw, 96px)",
  "--th-heading-align": "center",
  "--th-card-maxw": "953px",
  "--th-card-radius": "0px",
  "--th-card-blur": "none",
};

export const PAGE_LAYOUT: Record<PageThemeId, PageLayout> = {
  home: { vars: { ...base, "--th-card-radius": "45px" } },
  about: { vars: { ...base, "--th-heading-align": "left" } },
  work: { vars: { ...base } },
  education: { vars: { ...base } },
  projects: { vars: { ...base, "--th-card-maxw": "none" } },
  skills: {
    vars: {
      ...base,
      // A bit larger and lighter-weight than the webgl pill defaults (see SkillsPage.module.scss) —
      // kept from the original Figma gradient frame's proportions.
      "--th-pill-font": "clamp(16px, 1.9vw, 24px)",
      "--th-pill-pad": "4px 20px",
      "--th-pill-weight": "500",
    },
  },
};

export function layoutStyle(id: PageThemeId): CSSProperties {
  return PAGE_LAYOUT[id].vars as CSSProperties;
}
