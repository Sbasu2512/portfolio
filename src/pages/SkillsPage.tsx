import PageShell from "@/components/PageShell/PageShell";
import HighwayScene from "@/components/Scene/HighwayScene";
import { useData } from "@/context/DataContext";
import { pillGradient } from "@/utils/pillColor";
import styles from "./SkillsPage.module.scss";


export default function SkillsPage() {
  const { info } = useData();

  return (
    <PageShell scene={<HighwayScene />} sceneKey="highway" theme="skills" scrim="edge">
      <div className={`container ${styles.stage}`}>
        <h1 className={styles.heading}>Skills</h1>
        <div className={styles.panel}>
          <div className={styles.pills}>
            {info.skills.map((skill, i) => {
              // Every pill gets its own gradient; the helper picks colours so white text stays
              // readable on all of them (see utils/pillColor.ts).
              const { a, b } = pillGradient(i);
              return (
                <span
                  key={skill.name}
                  className={styles.pill}
                  style={{
                    ["--pill-a" as string]: a,
                    ["--pill-b" as string]: b,
                  }}
                >
                  {skill.name}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
