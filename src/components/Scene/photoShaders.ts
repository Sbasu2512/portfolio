/**
 * Shared GLSL for the photo backgrounds. Every page background is the real
 * photograph, sampled with the same "object-fit: cover" maths Figma uses, with
 * a few restrained effects layered on top (water shimmer, rain, dust, glow…).
 *
 * An effect chunk supplies two functions (q is in screen orientation: the mirror is applied only when sampling):
 *   vec2 warp(vec2 q, vec2 sp, float t)          — nudge the sampling position
 *   vec3 grade(vec2 q, vec2 sp, vec3 c, float t) — tweak the sampled colour
 * where q = image space (0..1, y down, *before* any mirroring), sp = screen space
 * (x scaled by aspect, y 0..1) and t = seconds.
 */

export const VERT = /* glsl */ `void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const PREFIX = /* glsl */ `
precision highp float;
uniform sampler2D uTex;
uniform vec2  uRes;     // drawing-buffer size, px
uniform vec2  uImg;     // photo size, px
uniform vec2  uFocus;   // CSS object-position, 0..1
uniform vec2  uMouse;   // smoothed pointer, -1..1
uniform float uTime;
uniform float uMirror;  // 1.0 = flip horizontally (Figma places the forest mirrored)
uniform float uZoom;    // small overscan so parallax never reveals an edge
uniform float uAspect;  // photo width / height
uniform float uLow;     // soundscape: wind / low-band level, 0..1 (0 when sound is off)
uniform float uHigh;    // soundscape: bird-chirp / high-band level, 0..1

float hash21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec2  hash22(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
             mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * vnoise(p); p = p * 2.03 + vec2(17.1, 9.2); a *= 0.5; }
  return v;
}
float luma(vec3 c){ return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

// Light streaks travelling along a lane A -> B (image space): car headlights, tail-lights,
// long-exposure tram trails. Streaks move toward B, bright head in front, tail behind.
//   w0/w1 = half-width at A / at B (perspective), density = streaks per lane length,
//   speed = lane-lengths per second, seed decorrelates lanes.
vec3 lane(vec2 q, vec2 A, vec2 B, float w0, float w1, float density, float speed, float seed, vec3 tint, float t){
  vec2 asp = vec2(uAspect, 1.0);
  vec2 pa = (q - A) * asp, ba = (B - A) * asp;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  float d = length(pa - ba * h);
  float w = mix(w0, w1, h);
  float u = h * density - t * speed + seed * 7.13;
  float cell = floor(u), f = fract(u);
  float r = hash21(vec2(cell, seed));
  float on = step(0.32, r);
  float prof = pow(f, 1.6) * (1.0 - smoothstep(0.88, 1.0, f));
  float ends = smoothstep(0.0, 0.05, h) * (1.0 - smoothstep(0.93, 1.0, h));
  float body = exp(-(d * d) / (w * w));
  vec3 col = mix(tint, vec3(1.0, 0.92, 0.75), step(0.82, r));
  return col * body * prof * on * ends * (0.6 + 0.7 * r);
}

// Sample the photo at image-space q (handles the optional mirror).
vec3 samp(vec2 q){
  q.x = mix(q.x, 1.0 - q.x, uMirror);
  return texture2D(uTex, clamp(q, 0.0, 1.0)).rgb;
}

// Image-space q for an arbitrary fragCoord — the same "object-fit: cover" mapping MAIN uses,
// so an effect can resample the photo somewhere other than its own pixel (see the Skills
// pixelation effect, which snaps every pixel in a block to one shared sample point).
vec2 coverUV(vec2 fragCoord){
  vec2 uv = vec2(fragCoord.x / uRes.x, 1.0 - fragCoord.y / uRes.y);
  float sc = max(uRes.x / uImg.x, uRes.y / uImg.y) * uZoom;
  vec2 size = uImg * sc;
  vec2 off = (uRes - size) * uFocus - uMouse * 0.006 * uRes;
  return (uv * uRes - off) / sc / uImg;
}
`;

const MAIN = /* glsl */ `
void main(){
  vec2 uv = vec2(gl_FragCoord.x / uRes.x, 1.0 - gl_FragCoord.y / uRes.y);
  vec2 sp = vec2(uv.x * uRes.x / uRes.y, uv.y);

  // object-fit: cover, positioned by uFocus
  float sc = max(uRes.x / uImg.x, uRes.y / uImg.y) * uZoom;
  vec2 size = uImg * sc;
  vec2 off = (uRes - size) * uFocus - uMouse * 0.006 * uRes;
  vec2 q = (uv * uRes - off) / sc / uImg;

  float t = uTime;
  q = warp(q, sp, t);
  vec3 c = samp(q);
  c = grade(q, sp, c, t);
  gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0);
}
`;

export function buildFragment(effect: string): string {
  return PREFIX + effect + MAIN;
}

/* ---------------------------------------------------------------------------
 * About — misty forest (photo is mirrored, exactly as placed in Figma)
 * Undergrowth sways, the light shafts breathe, dust drifts through the beams.
 * ------------------------------------------------------------------------- */
export const FOREST_EFFECT = /* glsl */ `
// Effects work in screen orientation (q is *before* the mirror), and the photo is flipped when sampled,
// so the clearing that sits at x = 0.768 in the file is at x = 1 - 0.768 on screen.
const vec2 LIGHT = vec2(0.232, 0.372);     // where the sun breaks through

float motes(vec2 p, float scale, float speed, float t){
  p *= scale;
  p.y += t * speed;
  p.x += sin(t * 0.3 + p.y * 2.0) * 0.25;
  vec2 id = floor(p), f = fract(p);
  vec2 r = hash22(id);
  vec2 pos = 0.2 + 0.6 * r + 0.10 * vec2(sin(t * 0.7 + r.x * 6.283), cos(t * 0.6 + r.y * 6.283));
  float d = length(f - pos);
  float twinkle = 0.55 + 0.45 * sin(t * 1.3 + r.x * 40.0);
  return (1.0 - smoothstep(0.0, 0.075, d)) * step(0.5, hash21(id + 3.0)) * twinkle;
}

vec2 warp(vec2 q, vec2 sp, float t){
  // Foliage: undergrowth sways all the time, harder when a gust of wind swells in the soundscape.
  float gust = 1.0 + 3.5 * uLow;
  float m = smoothstep(0.34, 0.78, q.y);
  float nearLight = exp(-length((q - LIGHT) * vec2(uAspect, 1.0)) * 2.2);
  vec2 iq = vec2(q.x * uAspect, q.y);
  float amp = (0.0045 * m + 0.0022 * nearLight) * gust;
  q.x += (fbm(iq * 6.0 + vec2(t * 0.16, t * 0.09)) - 0.5) * amp;
  q.y += (fbm(iq * 6.0 + vec2(5.0, t * 0.12)) - 0.5) * amp * 0.6;
  return q;
}

vec3 grade(vec2 q, vec2 sp, vec3 c, float t){
  vec2 iq = vec2(q.x * uAspect, q.y);
  vec2 d = (q - LIGHT) * vec2(uAspect, 1.0);
  float r = length(d);
  float L = luma(c);

  // Light rays fanning out from the clearing toward the viewer. They drift, sway with the wind
  // and swell with it — this is the part that ties the picture to the sound.
  float swell = 0.65 + 0.35 * sin(t * 0.45) + 0.9 * uLow;
  float ang = atan(d.y, d.x) + sin(t * 0.21) * 0.10 + uLow * 0.25;
  float rays = smoothstep(0.36, 0.84, fbm(vec2(ang * 4.5, t * 0.07 + r * 0.5)));
  float fan = smoothstep(-0.1, 0.8, dot(normalize(d + 1e-4), normalize(vec2(0.55, 0.85))));
  c += vec3(0.62, 0.95, 0.85) * rays * fan * exp(-r * 1.0) * smoothstep(0.03, 0.30, r) * 0.30 * swell;

  // The clearing itself pulses; each bird call flashes it a little brighter.
  c += vec3(0.85, 1.0, 0.95) * exp(-r * 5.0) * (0.10 + 0.05 * sin(t * 0.6) + 0.10 * uLow + 0.30 * uHigh);

  // Mist drifting through the trees, thickest where the light is.
  float mist = fbm(vec2(q.x * uAspect * 1.6 - t * 0.035, q.y * 2.6 + t * 0.012));
  c = mix(c, vec3(0.70, 0.85, 0.83), smoothstep(0.45, 0.80, mist) * 0.16 * (0.4 + smoothstep(0.1, 0.9, L)));

  // Dappled light flickering through the leaves.
  float dap = fbm(vec2(iq.x * 14.0 + t * 0.25, iq.y * 14.0 - t * 0.15));
  c *= 1.0 + (dap - 0.5) * (0.10 + 0.30 * uLow + 0.12 * uHigh) * smoothstep(0.15, 0.70, L);

  // Dust and pollen in the beams; they stream faster in a gust.
  float zone = exp(-r * 1.9);
  float sp2 = 1.0 + 2.0 * uLow;
  float m = motes(sp, 26.0, 0.020 * sp2, t) + 0.7 * motes(sp + 7.3, 44.0, 0.032 * sp2, t);
  c += vec3(1.0, 0.98, 0.90) * m * zone * 0.85;
  return c;
}
`;

/* ---------------------------------------------------------------------------
 * Work Experience — Kolkata at night
 * Lamps and windows twinkle, the long-exposure tram trails shimmer along their run.
 * ------------------------------------------------------------------------- */
export const CITY_EFFECT = /* glsl */ `
vec2 warp(vec2 q, vec2 sp, float t){ return q; }

vec3 grade(vec2 q, vec2 sp, vec3 c, float t){
  float L = luma(c);
  float hi = smoothstep(0.42, 0.85, L);

  // windows / lamps flickering
  vec2 g = vec2(q.x * uAspect, q.y) * 230.0;
  vec2 cell = floor(g);
  float tw = hash21(cell + floor(t * 1.4 + hash21(cell) * 9.0));
  c *= 1.0 + hi * (tw - 0.5) * 0.11;
  c += c * hi * 0.035 * sin(t * 1.7 + q.x * 9.0);

  // Traffic, fast. Trams and cabs sweep the cross-street in both directions as long-exposure
  // streaks; headlights stream down the road toward the camera, tail-lights away from it.
  vec3 s = vec3(0.0);
  s += lane(q, vec2(0.40, 0.90), vec2(1.02, 0.61), 0.0047, 0.0117, 3.0, 0.70, 1.0, vec3(1.00, 0.72, 0.28), t);
  s += lane(q, vec2(1.02, 0.73), vec2(0.50, 1.00), 0.0101, 0.0055, 3.4, 0.62, 2.0, vec3(1.00, 0.58, 0.20), t);
  s += lane(q, vec2(0.26, 1.00), vec2(0.64, 0.84), 0.0062, 0.0039, 3.2, 0.55, 3.0, vec3(1.00, 0.66, 0.24), t);
  s += lane(q, vec2(0.62, 0.70), vec2(1.02, 0.56), 0.0070, 0.0133, 2.4, 0.80, 4.0, vec3(0.55, 0.78, 1.00), t);
  s += lane(q, vec2(1.02, 0.66), vec2(0.60, 0.80), 0.0078, 0.0055, 2.6, 0.66, 7.0, vec3(0.60, 0.80, 1.00), t);
  s += lane(q, vec2(0.50, 0.96), vec2(1.02, 0.80), 0.0062, 0.0086, 3.6, 0.74, 8.0, vec3(1.00, 0.80, 0.35), t);
  s += lane(q, vec2(0.27, 0.19), vec2(0.45, 0.61), 0.0012, 0.0051, 6.0, 0.36, 5.0, vec3(1.00, 0.95, 0.80), t);
  s += lane(q, vec2(0.29, 0.20), vec2(0.49, 0.64), 0.0012, 0.0047, 5.0, 0.30, 6.0, vec3(1.00, 0.22, 0.14), t);
  c = 1.0 - (1.0 - c) * (1.0 - clamp(s * 1.6, 0.0, 1.0));
  return c;
}
`;

/* ---------------------------------------------------------------------------
 * Education — river at sunset
 * Water ripples below the horizon, the sun pulses, glitter runs down the reflection.
 * The photographer's credit in the bottom-right corner is left untouched.
 * ------------------------------------------------------------------------- */
export const HARBOR_EFFECT = /* glsl */ `
const float HORIZON = 0.614;
const vec2  SUN = vec2(0.914, 0.275);

float keep(vec2 q){ return 1.0 - step(0.86, q.x) * step(0.94, q.y); }   // photographer credit stays crisp

// The sunset drifts between deep amber and gold on two unsynchronised slow cycles — never a
// metronomic pulse, and never outside that warm range (no daylight or blue drift).
float sunset(float t){
  float v = 0.5 + 0.35 * sin(t * 0.17) + 0.15 * sin(t * 0.47 + 2.1);
  return clamp(v, 0.0, 1.0);
}

vec2 warp(vec2 q, vec2 sp, float t){
  float wm = smoothstep(HORIZON, HORIZON + 0.03, q.y) * keep(q);
  float depth = q.y - HORIZON;
  float w = sin(q.y * 520.0 - t * 1.6 + vnoise(vec2(q.x * 30.0, q.y * 40.0)) * 6.0);
  q.x += w * 0.0009 * wm * (0.3 + depth * 3.0);
  q.y += sin(q.x * 140.0 + t * 0.9) * 0.0004 * wm;
  return q;
}

vec3 grade(vec2 q, vec2 sp, vec3 c, float t){
  float k = keep(q);
  float g = sunset(t);                                             // 0 = deep amber & dim, 1 = gold & bright
  vec3 sunColor = mix(vec3(1.0, 0.50, 0.16), vec3(1.0, 0.80, 0.44), g);
  float sunStrength = mix(0.022, 0.135, g);   // wider swing — clearly brighter at the golden end

  // the sun, breathing between deep amber and gold
  vec2 d = (q - SUN) * vec2(uAspect, 1.0);
  // the disc itself breathes a little in size as well as brightness — bigger and brighter together
  float discFalloff = mix(16.0, 11.0, g);
  c += sunColor * exp(-length(d) * discFalloff) * sunStrength * k;
  // a wide, faint corona so the brightening reads even off the disc itself
  c += sunColor * exp(-length(d) * 4.0) * sunStrength * 0.55 * k;

  // glitter running down the sun's reflection, warming and brightening with the sun
  float col = exp(-pow((q.x - SUN.x) / 0.028, 2.0)) * (1.0 - smoothstep(0.35, 0.62, q.y));
  float sp2 = vnoise(vec2(q.x * 160.0, q.y * 420.0 - t * 1.4));
  c += sunColor * col * smoothstep(0.62, 0.90, sp2) * (0.16 + 0.16 * g) * k;

  // haze drifting above the far bank — amber to rose, always warm, so it reads as sunset
  // haze rather than daytime mist
  float hz = fbm(vec2(q.x * uAspect * 2.0 + t * 0.02, q.y * 5.0));
  vec3 hazeColor = mix(vec3(0.55, 0.32, 0.26), vec3(0.85, 0.52, 0.36), g);
  c += hazeColor * (hz - 0.5) * (0.022 + 0.045 * g) * (1.0 - smoothstep(0.15, 0.50, q.y)) * k;
  return c;
}
`;

export const RAIN_EFFECT = /* glsl */ `
const float GROUND = 0.585;   // where the wet road starts, image space

float rainLayer(vec2 sp, float cols, float speed, float len, float t, float seed){
  vec2 p = sp;
  p.x += p.y * 0.14;                                  // wind slant
  vec2 g = vec2(p.x * cols, p.y * cols * 0.12 - t * speed);   // minus: streaks fall (screen y points down)
  vec2 id = floor(g), f = fract(g);
  float h = hash21(id + seed);
  float x = 0.2 + 0.6 * hash21(id + seed + 5.0);
  float body = (1.0 - smoothstep(0.0, 0.06, abs(f.x - x))) * (1.0 - smoothstep(0.0, len, 1.0 - f.y));   // bright head at the bottom
  return body * step(0.50, h);
}

// xy = refraction offset, z = ring highlight
vec3 ripples(vec2 p, float t){
  vec3 acc = vec3(0.0);
  for (int l = 0; l < 2; l++) {
    float sc = l == 0 ? 8.0 : 14.0;
    vec2 gp = p * sc; gp.y *= 2.2;                    // perspective squash
    vec2 id = floor(gp), f = fract(gp) - 0.5;
    float h = hash21(id + float(l) * 13.0);
    float ph = fract(t * 0.42 + h * 3.7);
    vec2 dd = f - (hash22(id + float(l)) - 0.5) * 0.5;
    dd.y *= 2.2;
    float r = length(dd);
    float ring = exp(-pow((r - ph * 0.55) * 14.0, 2.0)) * (1.0 - ph) * step(0.30, h);
    acc.xy += normalize(dd + 1e-4) * ring;
    acc.z += ring;
  }
  return acc;
}

vec2 warp(vec2 q, vec2 sp, float t){
  float wm = smoothstep(GROUND, GROUND + 0.06, q.y);
  q += ripples(vec2(q.x * uAspect, q.y), t).xy * 0.0055 * wm;
  return q;
}

vec3 grade(vec2 q, vec2 sp, vec3 c, float t){
  // rain: three depths, near drops fast and bold, far drops fine and slow
  float r = rainLayer(sp, 34.0, 2.6, 0.95, t, 23.0) * 0.85
          + rainLayer(sp, 70.0, 3.1, 0.85, t, 0.0) * 0.70
          + rainLayer(sp, 120.0, 3.8, 0.70, t, 11.0) * 0.55;
  c += vec3(0.85, 0.90, 1.00) * r * 0.34;

  // splashes on the wet road
  float wm = smoothstep(GROUND, GROUND + 0.06, q.y);
  c += vec3(0.75, 0.82, 0.92) * ripples(vec2(q.x * uAspect, q.y), t).z * 0.16 * wm;
  return c;
}
`;

/* ---------------------------------------------------------------------------
 * Skills — the arch at dusk (Biswa Bangla Gate), pixelated
 * Snapped to a coarse block grid (retro 8-bit look, matching the pixel-style heading font used
 * elsewhere on this page) with a light colour quantization on top. The sunset still breathes,
 * haze still drifts and headlights still run the carriageways — all of it sampled at block
 * resolution, so the glow and the lights are chunky along with the photo instead of sitting on
 * top of it at full resolution.
 * ------------------------------------------------------------------------- */
export const GATE_EFFECT = /* glsl */ `
const vec2 GLOW = vec2(0.20, 0.30);   // where the sunset burns, in the photo
const float LEVELS = 7.0;             // colour bands after quantizing — higher = smoother, less 8-bit

vec2 warp(vec2 q, vec2 sp, float t){
  // Snap every pixel in a block to one shared sample point. ~130 blocks down the frame, so the
  // arch and the road are still readable but unmistakably pixelated.
  float block = max(2.0, uRes.y / 130.0);
  vec2 blockCenter = (floor(gl_FragCoord.xy / block) + 0.5) * block;
  return coverUV(blockCenter);
}

vec3 grade(vec2 q, vec2 sp, vec3 c, float t){
  float sky = 1.0 - smoothstep(0.30, 0.44, q.y);           // above the skyline only

  // the sunset breathes, and warm haze drifts across the sky
  vec2 d = (q - GLOW) * vec2(uAspect, 1.0);
  c += vec3(1.0, 0.55, 0.22) * exp(-length(d * vec2(0.8, 1.6)) * 3.2) * sky * (0.10 + 0.05 * sin(t * 0.4));
  float haze = fbm(vec2(q.x * uAspect * 2.0 + t * 0.02, q.y * 3.0 - t * 0.01));
  c += vec3(1.0, 0.75, 0.55) * (haze - 0.5) * 0.10 * sky;

  // dusk traffic: lights running both ways over the flyover, through the roundabout and along the carriageways
  vec3 s = vec3(0.0);
  s += lane(q, vec2(0.24, 0.437), vec2(1.02, 0.439), 0.0013, 0.0013, 9.0, 0.16, 11.0, vec3(1.00, 0.93, 0.78), t);
  s += lane(q, vec2(1.02, 0.446), vec2(0.24, 0.444), 0.0013, 0.0013, 8.0, 0.14, 12.0, vec3(1.00, 0.28, 0.18), t);
  s += lane(q, vec2(0.02, 0.585), vec2(0.30, 0.560), 0.0020, 0.0020, 4.0, 0.16, 13.0, vec3(1.00, 0.90, 0.72), t);
  s += lane(q, vec2(0.985, 0.560), vec2(0.62, 0.515), 0.0022, 0.0012, 5.0, 0.16, 14.0, vec3(1.00, 0.92, 0.76), t);
  s += lane(q, vec2(0.60, 0.625), vec2(0.99, 0.710), 0.0016, 0.0042, 5.0, 0.20, 15.0, vec3(1.00, 0.93, 0.78), t);
  s += lane(q, vec2(1.00, 0.95), vec2(0.62, 0.66), 0.0026, 0.0060, 7.0, 0.20, 1.0, vec3(1.00, 0.93, 0.78), t);
  s += lane(q, vec2(0.58, 0.64), vec2(0.93, 1.00), 0.0018, 0.0040, 6.0, 0.24, 2.0, vec3(1.00, 0.25, 0.16), t);
  s += lane(q, vec2(0.84, 1.00), vec2(0.52, 0.63), 0.0030, 0.0065, 7.0, 0.22, 3.0, vec3(1.00, 0.90, 0.72), t);
  s += lane(q, vec2(0.48, 0.63), vec2(0.74, 1.00), 0.0018, 0.0040, 6.0, 0.26, 4.0, vec3(1.00, 0.28, 0.18), t);
  c = 1.0 - (1.0 - c) * (1.0 - clamp(s, 0.0, 1.0));

  // a light colour quantization, so flat block-colours read as deliberate pixel art rather than
  // just a low-res photo
  c = floor(c * LEVELS + 0.5) / LEVELS;
  return c;
}
`;

/** No effect at all — the photograph exactly as it is. Used if an effect shader fails to compile. */
export const PLAIN_EFFECT = /* glsl */ `
vec2 warp(vec2 q, vec2 sp, float t){ return q; }
vec3 grade(vec2 q, vec2 sp, vec3 c, float t){ return c; }
`;
