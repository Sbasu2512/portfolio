import PhotoScene from "./PhotoScene";
import { HARBOR_EFFECT } from "./photoShaders";
import { GRADIENT_THEMES } from "@/theme/gradientThemes";

/** Education page — the river at sunset. */
export default function HarborScene({ className }: { className?: string }) {
  return <PhotoScene src="/scenes/education-river.jpg" effect={HARBOR_EFFECT} placeholder={GRADIENT_THEMES.dark.gradient} className={className} />;
}
