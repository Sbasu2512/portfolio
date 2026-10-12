import PhotoScene from "./PhotoScene";
import { FOREST_EFFECT } from "./photoShaders";
import { GRADIENT_THEMES } from "@/theme/gradientThemes";
import { useAudio } from "@/context/AudioContext";

/**
 * About page — misty forest. Figma places this photo mirrored, so we do too.
 * The light through the trees moves on its own and follows the soundscape's wind and bird calls.
 */
export default function ForestScene({ className }: { className?: string }) {
  const { getLevels } = useAudio();
  return (
    <PhotoScene
      src="/scenes/about-forest.jpg"
      effect={FOREST_EFFECT}
      mirrorX
      placeholder={GRADIENT_THEMES.dark.gradient}
      audioLevels={getLevels}
      className={className}
    />
  );
}
