import { useEffect, useMemo, useState } from "react";
import { useData } from "@/context/DataContext";
import { useAudio } from "@/context/AudioContext";
import StarfieldScene from "@/components/Scene/StarfieldScene";
import styles from "./Loader.module.scss";

const STAGE_MS = 1350;

export default function Loader({ onDone }: { onDone: () => void }) {
  const { info } = useData();
  const { setScene } = useAudio();
  const stages = info.loader.stages;
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState(1);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => setScene("space"), [setScene]);

  useEffect(() => {
    const dotTimer = setInterval(() => setDots((d) => (d % 3) + 1), 380);
    return () => clearInterval(dotTimer);
  }, []);

  useEffect(() => {
    if (stageIndex >= stages.length) {
      setLeaving(true);
      const t = setTimeout(onDone, 650);
      return () => clearTimeout(t);
    }
    const advance = setTimeout(() => setStageIndex((i) => i + 1), STAGE_MS);
    return () => clearTimeout(advance);
  }, [stageIndex, stages.length, onDone]);

  useEffect(() => {
    const total = stages.length * STAGE_MS;
    const start = performance.now();
    let raf = 0;
    function tick(now: number) {
      const pct = Math.min(100, ((now - start) / total) * 100);
      setProgress(pct);
      if (pct < 100) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stages.length]);

  const stage = stages[Math.min(stageIndex, stages.length - 1)];
  const remainingMinutes = useMemo(() => Math.max(0, Math.round(((100 - progress) / 100) * 4)), [progress]);

  return (
    <div className={[styles.loader, leaving ? styles.leaving : ""].join(" ")} role="status" aria-live="polite">
      <StarfieldScene speed={26} />
      <div className={styles.panel}>
        <h1 className={styles.title}>{stage.title}</h1>
        <p className={styles.sub}>
          {stage.sub}
          <span className={styles.dots} aria-hidden="true">{".".repeat(dots)}</span>
        </p>
        {stage.progress && (
          <div className={styles.progressWrap}>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <div className={styles.progressMeta}>
              <span>{Math.round(progress)}%</span>
              <span>{remainingMinutes} min remaining</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
