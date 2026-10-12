import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { SOUNDSCAPES, type SceneKey } from "@/audio/soundscapes";

interface AudioContextValue {
  enabled: boolean;
  volume: number; // 0-100
  enable: () => void;
  disable: () => void;
  setVolume: (v: number) => void;
  setScene: (key: SceneKey) => void;
  /**
   * Live loudness of the soundscape, so visuals can move with it. `low` follows the wind /
   * rumble, `high` follows bird calls and other bright sounds. Both 0..1, and 0 when sound is off.
   * Measured before the volume slider, so lowering the volume doesn't dim the visuals.
   */
  getLevels: () => AudioLevels;
}

export interface AudioLevels {
  low: number;
  high: number;
}

const SILENT: AudioLevels = { low: 0, high: 0 };

const Ctx = createContext<AudioContextValue | null>(null);

const DEFAULT_VOLUME = 16;
// Calibration for getLevels() — see the note there.
// Measured on the forest soundscape: wind swells move the raw low band between ~0.38 and ~0.58,
// bird calls push the high band from ~0.2 up to ~0.6.
const LOW_FLOOR = 0.38, LOW_GAIN = 5;
const HIGH_FLOOR = 0.35, HIGH_GAIN = 4;

export function AudioProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME);
  const [scene, setSceneState] = useState<SceneKey>("space");

  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const busRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const binsRef = useRef<Uint8Array | null>(null);
  const sceneGainRef = useRef<GainNode | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const currentSceneRef = useRef<SceneKey | null>(null);

  const ensureGraph = useCallback(() => {
    if (ctxRef.current) return ctxRef.current;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioCtx = new AC();
    const master = audioCtx.createGain();
    master.gain.value = volume / 100;
    master.connect(audioCtx.destination);
    // Scenes play into `bus`; the analyser listens to it ahead of the volume control.
    const bus = audioCtx.createGain();
    bus.connect(master);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.8;
    bus.connect(analyser);
    ctxRef.current = audioCtx;
    masterRef.current = master;
    busRef.current = bus;
    analyserRef.current = analyser;
    binsRef.current = new Uint8Array(analyser.frequencyBinCount);
    return audioCtx;
  }, [volume]);

  const playScene = useCallback((key: SceneKey) => {
    const audioCtx = ctxRef.current;
    const bus = busRef.current;
    if (!audioCtx || !bus) return;
    if (currentSceneRef.current === key) return;

    const prevGain = sceneGainRef.current;
    const prevCleanup = cleanupRef.current;
    const now = audioCtx.currentTime;

    if (prevGain) {
      prevGain.gain.cancelScheduledValues(now);
      prevGain.gain.setValueAtTime(prevGain.gain.value, now);
      prevGain.gain.linearRampToValueAtTime(0, now + 1.1);
      window.setTimeout(() => prevCleanup?.(), 1200);
    }

    const sceneGain = audioCtx.createGain();
    sceneGain.gain.setValueAtTime(0, now);
    sceneGain.gain.linearRampToValueAtTime(1, now + 1.4);
    sceneGain.connect(bus);
    const cleanup = SOUNDSCAPES[key](audioCtx, sceneGain);

    sceneGainRef.current = sceneGain;
    cleanupRef.current = () => {
      cleanup();
      sceneGain.disconnect();
    };
    currentSceneRef.current = key;
  }, []);

  const enable = useCallback(() => {
    const audioCtx = ensureGraph();
    if (audioCtx.state === "suspended") audioCtx.resume();
    setEnabled(true);
  }, [ensureGraph]);

  const disable = useCallback(() => {
    ctxRef.current?.suspend();
    setEnabled(false);
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (masterRef.current && ctxRef.current) {
      masterRef.current.gain.setTargetAtTime(v / 100, ctxRef.current.currentTime, 0.05);
    }
  }, []);

  const setScene = useCallback((key: SceneKey) => {
    setSceneState(key);
  }, []);

  const getLevels = useCallback((): AudioLevels => {
    const analyser = analyserRef.current, bins = binsRef.current, audioCtx = ctxRef.current;
    if (!analyser || !bins || !audioCtx || audioCtx.state !== "running") return SILENT;
    analyser.getByteFrequencyData(bins as Uint8Array<ArrayBuffer>);
    const hz = audioCtx.sampleRate / analyser.fftSize;
    let lowSum = 0, lowN = 0, high = 0;
    for (let i = 1; i < bins.length; i++) {
      const f = i * hz, v = bins[i] / 255;
      if (f < 900) { lowSum += v; lowN++; }
      else if (f > 1500 && f < 5200 && v > high) high = v;
    }
    const low = lowN ? lowSum / lowN : 0;
    // The raw readings sit in a narrow band; stretch them so the visuals get the full range.
    return {
      low: Math.min(1, Math.max(0, (low - LOW_FLOOR) * LOW_GAIN)),
      high: Math.min(1, Math.max(0, (high - HIGH_FLOOR) * HIGH_GAIN)),
    };
  }, []);

  useEffect(() => {
    if (enabled) playScene(scene);
  }, [enabled, scene, playScene]);

  useEffect(() => () => {
    cleanupRef.current?.();
    ctxRef.current?.close();
  }, []);

  return (
    <Ctx.Provider value={{ enabled, volume, enable, disable, setVolume, setScene, getLevels }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAudio(): AudioContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudio must be used within an AudioProvider");
  return ctx;
}
