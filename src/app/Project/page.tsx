'use client';

import styles from './project.module.css';
import ProjectCard from './ProjectCard/ProjectCard';
import info from '../../../info.json';
import type { PortfolioInfo } from '@/types/portfolio';

const portfolioInfo = info as PortfolioInfo;

export default function Project() {
  const projectDetails = portfolioInfo.projects;
  const skills = portfolioInfo.skills;

  return (
    <div className={styles.container} id="project">
      <div className={styles.wrapper}>
        <h1 className={`${styles.project_header} ${styles.roboto_bold} `}>
          Projects
        </h1>
      </div>
      <div className={`${styles.center_div} mt-3`}>
        <div className={styles.collage}>
          {projectDetails.map((deets, i) => (
            <ProjectCard key={i} project={deets} />
          ))}
        </div>
      </div>
      <div className={styles.wrapper}>
        <h1 className={`${styles.project_header} ${styles.roboto_bold} `}>
          Skills
        </h1>
      </div>
      <div className={`${styles.center_div} mt-3`}>
        <div className={`mb-5 ${styles.collage}`}>
          {skills.map((skill, i) => (
            <div
              key={i}
              className={`${styles.skills_card} ${styles.roboto_bold} ${styles.white} ${styles.animated_box}`}
            >
              <div>
                <img src={skill.icon} alt={skill.name} className={styles.card_img_sm} />
              </div>
              <span>{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
