import PhotoScene from "./PhotoScene";
import { CITY_EFFECT } from "./photoShaders";
import { GRADIENT_THEMES } from "@/theme/gradientThemes";

/** Work Experience page — Kolkata street at night, long-exposure trams. */
export default function CityScene({ className }: { className?: string }) {
  return <PhotoScene src="/scenes/work-city-night.jpg" effect={CITY_EFFECT} placeholder={GRADIENT_THEMES.dark.gradient} className={className} />;
}
