/**
 * Colours for the Skills pills, chosen by *relative luminance* rather than HSL lightness.
 *
 * At a fixed HSL lightness, yellow and green are far brighter to the eye than blue or purple, so
 * white text that reads fine on one pill vanishes on the next. Solving for luminance instead
 * guarantees the same white-text contrast on every hue while the hues themselves stay distinct.
 */

// WCAG relative luminance of an sRGB colour (channels 0..1).
function luminance(r: number, g: number, b: number): number {
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

// HSL (h in degrees, s and l in 0..1) -> sRGB channels 0..1.
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
}

/** White-text contrast ratio for a background of the given relative luminance. */
export function whiteContrast(lum: number): number {
  return 1.05 / (lum + 0.05);
}

/** The HSL lightness at which hue `h` (at saturation `s`) reaches relative luminance `target`. */
function lightnessForLuminance(h: number, s: number, target: number): number {
  let lo = 0.02, hi = 0.95; // luminance rises monotonically with lightness at a fixed hue/saturation
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    const [r, g, b] = hslToRgb(h, s, mid);
    if (luminance(r, g, b) < target) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

// 0.17 -> 4.8:1 against white at the lighter end, 0.10 -> 7:1 at the darker end.
const LUMA_LIGHT_END = 0.17;
const LUMA_DARK_END = 0.10;
const SATURATION = 0.85;

/** Two CSS colours (light end, dark end) for pill `index`, each guaranteed >= 4.5:1 with white text. */
export function pillGradient(index: number): { a: string; b: string; contrast: number } {
  const GOLDEN_ANGLE = 137.508; // successive hues far apart, so neighbours never look alike
  const hueA = (index * GOLDEN_ANGLE) % 360;
  const hueB = (hueA + 45) % 360;
  const lA = lightnessForLuminance(hueA, SATURATION, LUMA_LIGHT_END);
  const lB = lightnessForLuminance(hueB, SATURATION, LUMA_DARK_END);
  return {
    a: `hsl(${hueA.toFixed(1)} ${SATURATION * 100}% ${(lA * 100).toFixed(1)}%)`,
    b: `hsl(${hueB.toFixed(1)} ${SATURATION * 100}% ${(lB * 100).toFixed(1)}%)`,
    contrast: whiteContrast(LUMA_LIGHT_END),
  };
}

// Exported for tests only.
export const __test = { luminance, hslToRgb, lightnessForLuminance };
