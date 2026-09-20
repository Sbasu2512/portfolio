import PageShell from "@/components/PageShell/PageShell";
import RainScene from "@/components/Scene/RainScene";
import { useData } from "@/context/DataContext";
import styles from "./ProjectsPage.module.scss";

export default function ProjectsPage() {
  const { info } = useData();

  return (
    <PageShell scene={<RainScene />} sceneKey="rain">
      <div className="container">
        <h1 className={styles.heading}>Projects</h1>
        <div className={styles.grid}>
          {info.projects.map((project) => (
            <article className={styles.card} key={project.project_name}>
              <h2 className={styles.name}>{project.project_name}</h2>
              <p className={styles.desc}>{project.description}</p>
              <div className={styles.stack}>
                {project.tech_stack.split(",").map((t) => (
                  <span key={t.trim()}>{t.trim()}</span>
                ))}
              </div>
              <div className={styles.links}>
                {project.live_link && (
                  <a href={project.live_link} target="_blank" rel="noreferrer" className={styles.liveBtn}>
                    Live Demo <ArrowIcon />
                  </a>
                )}
                {project.repo_link && (
                  <a href={project.repo_link} target="_blank" rel="noreferrer" className={styles.repoBtn}>
                    Repository <RepoIcon repoType={project.repo_type} />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}
function RepoIcon({ repoType }: { repoType: string }) {
  if (repoType.toLowerCase() === "huggingface") {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M9 10h.01M15 10h.01M8 15c1.2 1 2.6 1.5 4 1.5s2.8-.5 4-1.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.26-.45-1.28.1-2.66 0 0 .84-.27 2.75 1.02a9.4 9.4 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.66.64.7 1.03 1.6 1.03 2.68 0 3.84-2.35 4.68-4.58 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}
