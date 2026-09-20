/**
 * Every "track" here is synthesized at runtime with the Web Audio API —
 * no external mp3 files, so there's nothing to license or fetch. Swap any
 * generator below for `new Audio(url)` if you'd rather ship real recordings.
 */

export type SceneKey =
  | "space"
  | "blackhole"
  | "forest"
  | "city"
  | "harbor"
  | "rain"
  | "highway";

type Cleanup = () => void;

function noiseBuffer(ctx: AudioContext, seconds = 2): AudioBuffer {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function loopedNoise(ctx: AudioContext, seconds = 2): AudioBufferSourceNode {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, seconds);
  src.loop = true;
  return src;
}

function lfo(ctx: AudioContext, rate: number, depth: number, target: AudioParam, base = 0) {
  const osc = ctx.createOscillator();
  osc.frequency.value = rate;
  const gain = ctx.createGain();
  gain.gain.value = depth;
  osc.connect(gain);
  gain.connect(target as unknown as AudioNode);
  if (base) target.value = base;
  osc.start();
  return osc;
}

/** Distant hum + slow filtered noise: the feel of drifting through open space. */
function spaceDrone(ctx: AudioContext, out: GainNode): Cleanup {
  const nodes: AudioScheduledSourceNode[] = [];

  const hum = ctx.createOscillator();
  hum.type = "sine";
  hum.frequency.value = 55;
  const humGain = ctx.createGain();
  humGain.gain.value = 0.18;
  hum.connect(humGain).connect(out);
  hum.start();
  nodes.push(hum);

  const noise = loopedNoise(ctx, 4);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 400;
  const nGain = ctx.createGain();
  nGain.gain.value = 0.06;
  noise.connect(filter).connect(nGain).connect(out);
  noise.start();
  nodes.push(noise);

  const shimmer = ctx.createOscillator();
  shimmer.type = "sine";
  shimmer.frequency.value = 220;
  const shimmerGain = ctx.createGain();
  shimmerGain.gain.value = 0.015;
  shimmer.connect(shimmerGain).connect(out);
  shimmer.start();
  nodes.push(shimmer);
  const lfoOsc = lfo(ctx, 0.05, 60, filter.frequency, 400);

  return () => {
    nodes.forEach((n) => n.stop());
    lfoOsc.stop();
  };
}

/** Very low, slightly detuned rumble with a resonant sweep — a black hole's gravity. */
function blackHoleRumble(ctx: AudioContext, out: GainNode): Cleanup {
  const nodes: AudioScheduledSourceNode[] = [];
  const osc1 = ctx.createOscillator();
  osc1.type = "sine";
  osc1.frequency.value = 38;
  const osc2 = ctx.createOscillator();
  osc2.type = "sawtooth";
  osc2.frequency.value = 39.3;
  const gain = ctx.createGain();
  gain.gain.value = 0.12;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 160;
  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(filter).connect(out);
  osc1.start();
  osc2.start();
  nodes.push(osc1, osc2);

  const noise = loopedNoise(ctx, 5);
  const nFilter = ctx.createBiquadFilter();
  nFilter.type = "bandpass";
  nFilter.frequency.value = 90;
  nFilter.Q.value = 0.6;
  const nGain = ctx.createGain();
  nGain.gain.value = 0.05;
  noise.connect(nFilter).connect(nGain).connect(out);
  noise.start();
  nodes.push(noise);
  const sweep = lfo(ctx, 0.03, 40, nFilter.frequency, 90);

  return () => {
    nodes.forEach((n) => n.stop());
    sweep.stop();
  };
}

/** Airy wind bed plus randomly-triggered chirps for insects/birds. */
function forestAmbience(ctx: AudioContext, out: GainNode): Cleanup {
  const nodes: AudioScheduledSourceNode[] = [];
  const wind = loopedNoise(ctx, 4);
  const windFilter = ctx.createBiquadFilter();
  windFilter.type = "lowpass";
  windFilter.frequency.value = 700;
  const windGain = ctx.createGain();
  windGain.gain.value = 0.05;
  wind.connect(windFilter).connect(windGain).connect(out);
  wind.start();
  nodes.push(wind);
  const windLfo = lfo(ctx, 0.08, 250, windFilter.frequency, 700);

  let alive = true;
  const timeouts: number[] = [];
  function chirp() {
    if (!alive) return;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    const base = 1800 + Math.random() * 1600;
    osc.frequency.setValueAtTime(base, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(base * 0.7, ctx.currentTime + 0.09);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.connect(g).connect(out);
    osc.start();
    osc.stop(ctx.currentTime + 0.14);
    timeouts.push(window.setTimeout(chirp, 500 + Math.random() * 2200));
  }
  timeouts.push(window.setTimeout(chirp, 600));

  return () => {
    alive = false;
    timeouts.forEach(clearTimeout);
    nodes.forEach((n) => n.stop());
    windLfo.stop();
  };
}

/** Filtered noise bed with slow passing "car" swells. */
function cityTraffic(ctx: AudioContext, out: GainNode): Cleanup {
  const bed = loopedNoise(ctx, 4);
  const bedFilter = ctx.createBiquadFilter();
  bedFilter.type = "lowpass";
  bedFilter.frequency.value = 500;
  const bedGain = ctx.createGain();
  bedGain.gain.value = 0.045;
  bed.connect(bedFilter).connect(bedGain).connect(out);
  bed.start();

  let alive = true;
  const timeouts: number[] = [];
  function passBy() {
    if (!alive) return;
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = 90;
    const g = ctx.createGain();
    g.gain.value = 0;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 300;
    osc.connect(filter).connect(g).connect(out);
    const dur = 1.6 + Math.random() * 1.2;
    const now = ctx.currentTime;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.09, now + dur * 0.4);
    g.gain.linearRampToValueAtTime(0, now + dur);
    osc.start(now);
    osc.stop(now + dur);
    timeouts.push(window.setTimeout(passBy, dur * 900 + Math.random() * 1200));
  }
  timeouts.push(window.setTimeout(passBy, 300));

  return () => {
    alive = false;
    timeouts.forEach(clearTimeout);
    bed.stop();
  };
}

/** Low water noise plus an occasional ship horn. */
function harborWater(ctx: AudioContext, out: GainNode): Cleanup {
  const water = loopedNoise(ctx, 5);
  const wf = ctx.createBiquadFilter();
  wf.type = "lowpass";
  wf.frequency.value = 340;
  const wg = ctx.createGain();
  wg.gain.value = 0.06;
  water.connect(wf).connect(wg).connect(out);
  water.start();
  const wLfo = lfo(ctx, 0.12, 90, wf.frequency, 340);

  let alive = true;
  const timeouts: number[] = [];
  function honk() {
    if (!alive) return;
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = 110;
    const g = ctx.createGain();
    const now = ctx.currentTime;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.07, now + 0.15);
    g.gain.setValueAtTime(0.07, now + 0.9);
    g.gain.linearRampToValueAtTime(0, now + 1.3);
    osc.connect(g).connect(out);
    osc.start(now);
    osc.stop(now + 1.4);
    timeouts.push(window.setTimeout(honk, 6000 + Math.random() * 9000));
  }
  timeouts.push(window.setTimeout(honk, 3000));

  return () => {
    alive = false;
    timeouts.forEach(clearTimeout);
    water.stop();
    wLfo.stop();
  };
}

/** Bright filtered white noise for rain, with occasional low thunder-ish thuds. */
function rainfall(ctx: AudioContext, out: GainNode): Cleanup {
  const rain = loopedNoise(ctx, 3);
  const rf = ctx.createBiquadFilter();
  rf.type = "highpass";
  rf.frequency.value = 1600;
  const rg = ctx.createGain();
  rg.gain.value = 0.05;
  rain.connect(rf).connect(rg).connect(out);
  rain.start();

  const bed = loopedNoise(ctx, 3);
  const bf = ctx.createBiquadFilter();
  bf.type = "lowpass";
  bf.frequency.value = 500;
  const bg = ctx.createGain();
  bg.gain.value = 0.035;
  bed.connect(bf).connect(bg).connect(out);
  bed.start();

  return () => {
    rain.stop();
    bed.stop();
  };
}

/** Steady rush-bed with rhythmic engine swells for cars streaming past. */
function highwayFlow(ctx: AudioContext, out: GainNode): Cleanup {
  const bed = loopedNoise(ctx, 3);
  const bf = ctx.createBiquadFilter();
  bf.type = "bandpass";
  bf.frequency.value = 700;
  bf.Q.value = 0.5;
  const bg = ctx.createGain();
  bg.gain.value = 0.06;
  bed.connect(bf).connect(bg).connect(out);
  bed.start();
  const sweep = lfo(ctx, 0.22, 300, bf.frequency, 700);
  return () => {
    bed.stop();
    sweep.stop();
  };
}

export const SOUNDSCAPES: Record<SceneKey, (ctx: AudioContext, out: GainNode) => Cleanup> = {
  space: spaceDrone,
  blackhole: blackHoleRumble,
  forest: forestAmbience,
  city: cityTraffic,
  harbor: harborWater,
  rain: rainfall,
  highway: highwayFlow,
};
