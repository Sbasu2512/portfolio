import { useEffect, type ReactNode } from "react";
import Nav from "@/components/Nav/Nav";
import Footer from "@/components/Footer/Footer";
import SoundToggle from "@/components/SoundToggle/SoundToggle";
import { useAudio } from "@/context/AudioContext";
import type { SceneKey } from "@/audio/soundscapes";
import styles from "./PageShell.module.scss";

interface Props {
  scene: ReactNode;
  sceneKey: SceneKey;
  children: ReactNode;
  bare?: boolean; // true = no nav/footer chrome (landing page draws its own)
}

export default function PageShell({ scene, sceneKey, children, bare }: Props) {
  const { setScene } = useAudio();
  useEffect(() => setScene(sceneKey), [sceneKey, setScene]);

  return (
    <div className={styles.page}>
      <div className={styles.sceneLayer}>{scene}</div>
      <div className={styles.scrim} />
      {!bare && <Nav />}
      <main className={styles.content}>{children}</main>
      {!bare && <Footer />}
      <SoundToggle />
    </div>
  );
}
