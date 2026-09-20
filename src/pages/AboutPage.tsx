import PageShell from "@/components/PageShell/PageShell";
import ForestScene from "@/components/Scene/ForestScene";
import { useData } from "@/context/DataContext";
import styles from "./AboutPage.module.scss";

export default function AboutPage() {
  const { info } = useData();
  const paragraphs = info.personal.about_me.split(/\n\n+/).filter(Boolean);

  return (
    <PageShell scene={<ForestScene />} sceneKey="forest">
      <div className="container">
        <div className={styles.card}>
          <h1 className={styles.heading}>
            <span aria-hidden="true">👋</span> About Me
          </h1>
          <div className={styles.copy}>
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
