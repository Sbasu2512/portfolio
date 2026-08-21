import styles from './ProjectCard.module.css';
import type { Project } from '@/types/portfolio';

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const hasImage = Boolean(project.image_url && project.image_url !== 'null');

  return (
    <div className={styles.card}>
      {hasImage ? (
        <img src={project.image_url} alt={project.project_name} className={styles.image} />
      ) : (
        <div className={styles.imagePlaceholder} aria-hidden="true">
          <span>{project.project_name}</span>
        </div>
      )}

      <div className={styles.overlay}>
        <h3>{project.project_name}</h3>

        <p className={styles.stack}>{project.tech_stack}</p>

        <p className={styles.description}>{project.description}</p>

        <div className={styles.buttons}>
          {project.live_link && (
            <a
              href={project.live_link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.live}
            >
              Live Demo
            </a>
          )}

          {project.repo_link && (
            <a
              href={project.repo_link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.repo}
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
