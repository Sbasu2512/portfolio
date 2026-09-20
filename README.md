# Sayantan Basu — Portfolio

React + TypeScript + SCSS single-page portfolio. Vite build, one data file, one
route per nav link, everything animated with plain HTML/CSS canvas and one
Three.js scene.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build -> dist/
npm run preview   # serve the production build
```

## Everything comes from one file

`src/data/info.json` is the single source of truth — personal info, work
experience, education, projects, skills, the nav links, the loader copy, and
the locale strings. Add or remove an entry in `nav` and:

- a new route appears (`src/App.tsx` maps each `nav[i].id` to a page
  component via the `PAGES` lookup — add your new page there too)
- the nav bar re-spaces itself automatically (`Nav.module.scss` uses
  `justify-content: space-evenly` across whatever `info.nav` renders, so
  there's no hardcoded width/count anywhere)

Add a work experience, a project, a skill, an education entry the same way —
every page maps `info.json` arrays directly, nothing is hand-duplicated.

## The two "layers" on top of the raw data

`src/context/DataContext.tsx` derives two things from `info.json` at render
time, without mutating the file itself:

1. **Phone number by region** — a network-free heuristic
   (`src/hooks/useRegion.ts`) reads the browser's timezone/locale. If it looks
   like the US or Canada, the resume shows `locale.na_phone`; otherwise
   `locale.default_phone`. No geo-IP call, no consent prompt, fails safe to
   the default number. Swap in a real geo-IP service there if you'd rather.
2. **India → "Remote"** — any `work_experience` entry whose `location`
   mentions India/Chennai/Bangalore/Kolkata is relabelled using
   `locale.india_remote_note` ("Remote") everywhere work experience is
   rendered (the Work Experience page and the Resume page both read from
   `useData().workExperience`, never the raw array).

## Sound

`src/audio/soundscapes.ts` synthesizes every ambient track at runtime with
the Web Audio API — a low drone for the loader, a sub-bass rumble for the
black hole, filtered noise + chirps for the forest, traffic beds for the two
road scenes, water + a ship horn for the harbor, and filtered noise for rain.
Nothing is fetched, nothing needs a license. The volume slider (bottom-right
on every page) is the only audio control shown — per the brief, there's no
scrubber/pause UI for the *animations* themselves, they just run. Browsers
block audio before a user gesture, so sound starts on the first click of that
control, not automatically.

Swap any generator for `new Audio("/your-track.mp3")` if you'd rather ship
real recordings — `AudioContext.tsx`'s `setScene()` API doesn't care which.

## Scenes

Six of the seven backgrounds are plain `<canvas>` 2D animations
(`src/components/Scene/*.tsx`), each running through a shared
`useCanvasLoop` hook that handles resize, devicePixelRatio, and
`prefers-reduced-motion` (renders one frame and stops). The landing page's
black hole is Three.js — the same shader built earlier in this conversation,
with the forest-texture sampling removed (deep space instead, since the
forest belongs to the About page here).

| Route | Scene | File |
|---|---|---|
| `/` | Swirling accretion disc | `BlackHoleScene.tsx` (Three.js) |
| `/about` | Layered forest, hue-shifting light | `ForestScene.tsx` |
| `/work-experience` | Night street, cars both directions | `CityScene.tsx` |
| `/education` | Harbor sunset, ships, shimmering sun | `HarborScene.tsx` |
| `/projects` | Rain hitting water, ripples | `RainScene.tsx` |
| `/skills` | Daytime highway, no cyclists | `HighwayScene.tsx` |
| loader | Star field with parallax streaks | `StarfieldScene.tsx` |

## Resume route

`/resume` is adapted from the `page.tsx` you provided, wired to the same
`DataContext` (so it picks up the region-aware phone number and the
Remote-relabelled work experience automatically) and styled with your
`resume.css`, ported to `resume.scss`. It referenced six icon SVGs at
`/assets/logo/*.svg` that weren't in the upload — I supplied plain line-icon
placeholders in `public/assets/logo/`; swap those for your real ones anytime,
same file names. The PDF export button dynamically imports `html2pdf.js`
(listed as an optional dependency) and falls back to `window.print()` if
that's unavailable.

## Responsive breakpoints

Defined once in `src/styles/variables.scss`, used everywhere via
`@include respond(name)`:

```
mobile   0px      tablet   600px     laptop   1024px  (11–15" laptops)
desktop  1440px   big-24   1920px    big-32   2560px
```

## Fixed: blank screen after the loader

If you saw the loading screens play through and then land on a completely
empty `<div id="root"></div>`, that was a real bug — the landing page's
Three.js black hole had no guard around WebGL context creation. In some
environments (blocked/disabled GPU access, sandboxed preview iframes,
`--disable-gpu`-style restrictions, certain "insecure connection" preview
tools) `new THREE.WebGLRenderer()` throws, and with no error boundary
anywhere in the tree, React's default behavior is to unmount everything —
hence the totally empty root.

Two things are fixed now:
1. `BlackHoleScene.tsx` wraps WebGL setup in `try/catch` and falls back to a
   CSS-only radial-gradient stand-in if WebGL is unavailable for any reason,
   so the landing page (nav, hero, social icons, footer) still renders.
2. A top-level `ErrorBoundary` wraps the whole app (loader included) as a
   safety net for anything else that might throw in the future — it shows a
   small recoverable message instead of a blank page.

I also found and fixed a related issue while debugging this: the Google
Fonts import was a CSS `@import` inside the bundled stylesheet, which is
render-blocking — if that request is slow or unreachable, the whole page's
first paint can stall behind it. Moved it to `<link rel="preconnect">` +
`<link rel="stylesheet">` in `index.html` instead, which loads in parallel
and doesn't block rendering. Verified by disabling WebGL entirely and by
running the build in a network-sandboxed environment (fonts.googleapis.com
blocked) — the page still renders correctly in both cases.

## Known gaps / assumptions, worth a look before you ship

- **Figma-verified**: nav order, the forest-inside-the-black-hole treatment on
  the landing page, the resume icon (4th hero social icon, not a nav link),
  the "Handjet" display font, the violet timeline accent, and the project
  card buttons were all corrected against the real Figma file
  (`OKoCQTUmOAnR9SAiha5ECt`, node `4116-777`) once it was connected. The
  `Themes` nav slot is now an inert badge showing `logo.ico`, exactly where
  the Figma "Themes" dropdown sits, per the brief.
- **Region detection** for the phone number swap is a client-side timezone/locale
  heuristic, not a geo-IP call — no network request, but not bulletproof against
  VPNs.
- **Background music is synthesized** (Web Audio oscillators/noise), not licensed
  mp3s — so there's nothing to clear rights on, but if you'd rather have real
  recordings, swap them in at `src/audio/soundscapes.ts`.
- **Bundle is ~680KB** before gzip (mostly Three.js + React). Fine for a
  portfolio; flagged in the README if you want to lazy-load the black hole
  scene later.
- The six icon SVGs your `resume.css` expected at `/assets/logo/*.svg` weren't
  in your upload, so I added plain placeholder line icons at that path — swap
  them for your real ones anytime.
- Everything was verified with a headless-Chromium screenshot pass against a
  production build (every route, plus mobile at 390px with the hamburger menu
  open) rather than guessed from code alone.
