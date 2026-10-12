# Sayantan Basu — Portfolio

React + TypeScript + SCSS single-page portfolio. Vite build, one data file, one
route per nav link, animated with Three.js photo shaders (or CSS gradients when WebGL is unavailable).

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

## Two render modes: WebGL photos, or gradients

`src/hooks/useRenderMode.tsx` decides once at load:

| Mode | When | Background |
|---|---|---|
| `webgl` | hardware-accelerated WebGL is available | Three.js shaders drawing the real photos (below) |
| `gradient` | WebGL is blocked, disabled, or software-only (hardware acceleration off) | flat CSS gradients from the Figma frames |

If WebGL dies *after* load (context lost, texture fails, shader throws) the whole
site drops to `gradient` instead of showing a blank page. For testing:
`?render=gradient`, `?render=webgl`, or `?render=auto` to clear the override
(remembered for the browser tab).

### Gradient themes: dark and light

Gradient mode has two themes, the same on every page, defined in `src/theme/gradientThemes.ts`:

| Theme | Background | Text |
|---|---|---|
| `dark` (default) | `#152331` → `#000000` | white |
| `light` | `#fc5c7d` → `#6a82fb` | dark |

The toggle button (`components/ThemeToggle`) replaces the home logo in the nav — gradient mode has
no logo at all — and the choice persists in `localStorage` (`hooks/useGradientTheme.tsx`). WebGL mode
ignores all of this: it keeps the home logo (hidden only on the landing page) and has no toggle.

Colour and layout are split. `gradientThemes.ts` holds colour (gradient, ink, glass tint) and
`theme/pageThemes.ts` holds per-page layout (card width, heading alignment, pill sizing); `PageShell`
merges the two as `--th-*` CSS custom properties, and page styles read them through
`src/styles/_theme.scss`, falling back to the photo-page look when a variable isn't set. (Prefixed
`--th-` because `resume.scss` already defines a global `--ink`.) `Nav` and `Footer` read
`--th-nav-ink` / `--th-topbar-ink` / `--th-footer-ink` directly, so they follow the theme with no
overrides. To add a theme, add an entry to `GRADIENT_THEMES` and widen `GradientThemeId`.

**Skills, WebGL mode** swaps to dark text because the gate photo's sky is bright — see the last rule
in `PageShell.module.scss`. The footer stays light (it sits over the dark road), the mobile menu's
links stay white (they sit on the menu's own dark panel), and the top edge scrim is removed on that
page (it would grey the sky behind dark text).

**Skills pills** always have white text. `utils/pillColor.ts` picks each pill's gradient by target
*luminance* rather than HSL lightness, so white text keeps ≥ 4.5:1 on every hue (yellow and green are
far brighter than blue at equal HSL lightness). Tune `LUMA_LIGHT_END` / `LUMA_DARK_END` to make them
lighter or darker.

## Scenes (WebGL mode)

Every page except the landing page is one photograph drawn by `PhotoScene.tsx`
(orthographic quad + `ShaderMaterial`, "object-fit: cover" maths) with a few restrained
effects from `photoShaders.ts`. Textures are sampled raw so the pixels match the photo.

| Route | Photo (`public/scenes/`) | Effects |
|---|---|---|
| `/` | — | Swirling accretion disc, `BlackHoleScene.tsx` |
| `/about` | `about-forest.jpg` (mirrored, as in Figma) | light rays fanning from the clearing, drifting mist, dappled leaves, dust; **tied to the soundscape** — wind gusts swell the rays and sway the foliage, bird calls flash the clearing |
| `/work-experience` | `work-city-night.jpg` | twinkling lamps; trams, cabs and headlights streaking along the roads in both directions |
| `/education` | `education-river.jpg` | water ripples; the sun and its glitter/haze drift between deep amber and gold — always sunset, never daylight (photographer's credit left untouched) |
| `/projects` | `projects-taxi.jpg` | falling rain in three depths, splashes and ripples on the wet road |
| `/skills` | `skills-gate.jpg` (Biswa Bangla Gate) | pixelated to a coarse block grid + colour quantization (retro 8-bit look); breathing sunset, drifting haze, lights running along the flyover, roundabout and carriageways, all sampled at block resolution |
| loader | — | Star field (canvas), `StarfieldScene.tsx` |

Photo credits and licence notes are in `LICENSES.md`. Swap a photo by replacing the
file (same name) or changing `src` in the matching `*Scene.tsx`; pointer parallax is
off under `prefers-reduced-motion`, which also freezes the effects.

**Sound-reactive light.** `AudioContext.getLevels()` reads an analyser that listens ahead of the
volume control and returns `{ low, high }` (0..1; wind/rumble and bright sounds like bird calls).
`PhotoScene` feeds them to the shader as `uLow` / `uHigh`; only the About scene uses them today.
The calibration constants at the top of `AudioContext.tsx` were measured on the forest soundscape.

**Sound is WebGL-only.** `PageShell` renders `<SoundToggle />` (and plays anything at all) only
when `mode === "webgl"`; the gradient themes are silent, and switching to gradients mid-session
(a WebGL failure) stops whatever was playing. There's no music setting to turn back on in
gradient mode — the toggle simply isn't there.

**Animation timing runs on wall-clock time** (`performance.now()`), not an accumulated per-frame
delta — a capped delta-per-frame makes simulated time crawl behind real time on a slow GPU, since
each frame can only advance the cap even when far more real time has passed. `PhotoScene.tsx`.

**Shader safety net.** If an effect shader fails to compile on some GPU, `PhotoScene` logs the error and
shows the plain photograph instead (and only falls back to gradients if that fails too).

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
