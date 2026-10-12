import styles from "./GradientBackground.module.scss";

/** Flat CSS gradient backdrop used when WebGL isn't available. */
export default function GradientBackground({ gradient }: { gradient: string }) {
  return <div className={styles.gradient} style={{ backgroundImage: gradient }} aria-hidden="true" />;
}
