"use client";
import React, { useState } from "react";
import styles from "./work.module.css";
import WorkCard from "../Components/CommonComponents/WorkCard/WorkCard";
import info from "../../../info.json";
import EducationCard from "../Components/CommonComponents/EducationCard/educationCard";

export default function Work() {
  const [jobDetails, setJobDetails] = useState(info.work_experience);
  const [educationDetails, setEducationDetails] = useState(info.education);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.work_ex_header}>
          <h1 className={`${styles.playfair_display_header} `}>
            <span>Work Experience</span>
          </h1>
        </div>
        <div className={styles.work_ex_padding}>
          {jobDetails &&
            jobDetails.map((detail, i) => (
              <div key={i} className={styles.cards}>
                <WorkCard work_details={detail} />
              </div>
            ))}
        </div>
        <div className={styles.work_ex_header}>
          <span>
            <h1 className={`${styles.playfair_display_header} `}>Education</h1>
          </span>
        </div>
        <div className={`${styles.cards} ${styles.work_ex_padding}`}
        >
          {educationDetails &&
            educationDetails.map((detail, i) => (
              <div key={i} className={styles.cards}>
                <EducationCard education={detail} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
