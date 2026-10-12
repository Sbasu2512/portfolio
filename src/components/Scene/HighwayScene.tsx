import PhotoScene from "./PhotoScene";
import { GATE_EFFECT } from "./photoShaders";
import { GRADIENT_THEMES } from "@/theme/gradientThemes";

/**
 * Skills page — Biswa Bangla Gate at dusk. The photo is a tall portrait, so the cover crop is
 * pinned near the top (focus y = 0.3) to keep the whole arch in frame with the road beneath it.
 */
export default function HighwayScene({ className }: { className?: string }) {
  return <PhotoScene src="/scenes/skills-gate.jpg" effect={GATE_EFFECT} focus={[0.5, 0.3]} placeholder={GRADIENT_THEMES.dark.gradient} className={className} />;
}
