"use client";
import React, { useState } from "react";
import styles from './project.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCode, faCode } from "@fortawesome/free-solid-svg-icons";
import info from '../../../info.json';

export default function Project(props) {

    const [projectDetails, setProjectDetails] = useState(info.projects);
    const [skills, setSkills] = useState(info.skills);
    

    return (
      <div className={`${styles.container}`} id="project">
        <div className={`${styles.wrapper}`}>
          <h1 className={`${styles.project_header} ${styles.roboto_bold} `}>
            Projects
          </h1>
        </div>
        <div className={`${styles.center_div} mt-3`}>
          <div className={styles.collage}>
            {projectDetails &&
              projectDetails.map((deets, i) => (
                <div key={i} className={styles.animated_box}>
                  <img
                    src={deets.image_url}
                    alt={deets.project_name}
                    className={`${styles.card_img}`}
                  />
                </div>
              ))}
          </div>
        </div>
        <div className={`${styles.wrapper}`}>
          <h1 className={`${styles.project_header} ${styles.roboto_bold} `}>
            Skills
          </h1>
        </div>
        <div className={`${styles.center_div} mt-3`}>
          <div className={`mb-5 ${styles.collage}`}>
            {skills &&
              skills.map((skill, i) => (
                <div
                  key={i}
                  className={`${styles.skills_card} ${styles.roboto_bold} ${styles.white} ${styles.animated_box}`}
                >
                  <div>
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className={`${styles.card_img_sm}`}
                    />
                  </div>
                  <span>{skill.name}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
}