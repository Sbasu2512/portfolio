"use client";
import React, { useState } from "react";
import styles from "./work.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import CommonCard from "../Components/CommonComponents/Card/card";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import info from "../../../info.json";
import EducationCard from "../Components/CommonComponents/EducationCard/educationCard";

export default function Work() {
  const [jobDetails, setJobDetails] = useState(info.work_experience);
  const [educationDetails, setEducationDetails] = useState(info.education);

  return (
    <div className={`mt-2 ${styles.white_background} ${styles.bottom_margin}`}>
      <div className={`${styles.center_div}`}>
        <h1 className="mt-4">
          <span>
            <FontAwesomeIcon icon={faBriefcase} />
          </span>
          <span className={`${styles.roboto_bold} ${styles.left_margin}`}>
            Work Experience
          </span>
        </h1>
      </div>
      <div
        className={`${styles.left_div} ${styles.flex_col} ${styles.roboto} ${styles.w_80pct} ${styles.pad_3rem}`}
      >
        {jobDetails &&
          jobDetails.map((detail, i) => (
            <div key={i} className={`mt-2 w-100`}>
              <CommonCard work_details={detail} />
            </div>
          ))}
      </div>
      <div className={styles.center_div}>
        <h1 className="mt-4">
          <span>
            <FontAwesomeIcon icon={faGraduationCap} />
          </span>
          <span className={`${styles.roboto_bold} ${styles.left_margin}`}>
            Education
          </span>
        </h1>
      </div>
      <div
        className={`${styles.left_div} ${styles.flex_col} ${styles.roboto} ${styles.w_80pct} ${styles.pad_3rem}`}
      >
        {educationDetails &&
          educationDetails.map((detail, i) => (
            <div key={i} className="mt-2 w-100">
              <EducationCard education={detail} />
            </div>
          ))}
      </div>
    </div>
  );
}
