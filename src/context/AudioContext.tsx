import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { SOUNDSCAPES, type SceneKey } from "@/audio/soundscapes";

interface AudioContextValue {
  enabled: boolean;
  volume: number; // 0-100
  enable: () => void;
  disable: () => void;
  setVolume: (v: number) => void;
  setScene: (key: SceneKey) => void;
}

const Ctx = createContext<AudioContextValue | null>(null);

const DEFAULT_VOLUME = 16;

export function AudioProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME);
  const [scene, setSceneState] = useState<SceneKey>("space");

  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
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
    ctxRef.current = audioCtx;
    masterRef.current = master;
    return audioCtx;
  }, [volume]);

  const playScene = useCallback((key: SceneKey) => {
    const audioCtx = ctxRef.current;
    const master = masterRef.current;
    if (!audioCtx || !master) return;
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
    sceneGain.connect(master);
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

  useEffect(() => {
    if (enabled) playScene(scene);
  }, [enabled, scene, playScene]);

  useEffect(() => () => {
    cleanupRef.current?.();
    ctxRef.current?.close();
  }, []);

  return (
    <Ctx.Provider value={{ enabled, volume, enable, disable, setVolume, setScene }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAudio(): AudioContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudio must be used within an AudioProvider");
  return ctx;
}
