import PageShell from "@/components/PageShell/PageShell";
import HighwayScene from "@/components/Scene/HighwayScene";
import { useData } from "@/context/DataContext";
import styles from "./SkillsPage.module.scss";

export default function SkillsPage() {
  const { info } = useData();

  return (
    <PageShell scene={<HighwayScene />} sceneKey="highway">
      <div className="container">
        <h1 className={styles.heading}>Skills</h1>
        <div className={styles.pills}>
          {info.skills.map((skill, i) => {
            const hueA = (i * 47) % 360;
            const hueB = (hueA + 55) % 360;
            return (
              <span
                key={skill.name}
                className={styles.pill}
                style={{
                  // Each pill gets its own gradient, derived from its index.
                  ["--pill-a" as string]: `hsl(${hueA} 85% 62%)`,
                  ["--pill-b" as string]: `hsl(${hueB} 85% 50%)`,
                }}
              >
                {skill.name}
              </span>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
