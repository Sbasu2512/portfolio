import { useAudio } from "@/context/AudioContext";
import styles from "./SoundToggle.module.scss";

export default function SoundToggle() {
  const { enabled, volume, enable, disable, setVolume } = useAudio();

  return (
    <div className={styles.wrap} role="group" aria-label="Background sound">
      <button
        type="button"
        className={styles.toggle}
        onClick={() => (enabled ? disable() : enable())}
        aria-pressed={enabled}
        aria-label={enabled ? "Mute background sound" : "Play background sound"}
        title={enabled ? "Mute" : "Play ambient sound"}
      >
        {enabled ? <IconOn /> : <IconOff />}
      </button>
      <input
        className={styles.slider}
        type="range"
        min={0}
        max={100}
        value={volume}
        onChange={(e) => {
          const v = Number(e.target.value);
          setVolume(v);
          if (!enabled && v > 0) enable();
        }}
        aria-label="Ambient sound volume"
      />
    </div>
  );
}

function IconOn() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M3 9v6h4l5 5V4L7 9H3z" fill="currentColor" />
      <path d="M16 8.5a4.5 4.5 0 0 1 0 7" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M18.5 6a8 8 0 0 1 0 12" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".6" />
    </svg>
  );
}
function IconOff() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M3 9v6h4l5 5V4L7 9H3z" fill="currentColor" />
      <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
