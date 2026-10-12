import PhotoScene from "./PhotoScene";
import { RAIN_EFFECT } from "./photoShaders";
import { GRADIENT_THEMES } from "@/theme/gradientThemes";

/** Projects page — monsoon rain on a Kolkata street. */
export default function RainScene({ className }: { className?: string }) {
  return <PhotoScene src="/scenes/projects-taxi.jpg" effect={RAIN_EFFECT} placeholder={GRADIENT_THEMES.dark.gradient} className={className} />;
}
