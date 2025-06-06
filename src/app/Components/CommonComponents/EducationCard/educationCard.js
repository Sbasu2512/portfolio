import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faSchool } from "@fortawesome/free-solid-svg-icons";
import styles from "./educationCard.module.css";
import BaseCard from "../Card/BaseCard";

export default function EducationCard(props) {
  const {
    course_name,
    institute,
    grad_year,
    location,
    degree_type,
    description,
  } = props.education;

  return (
    <BaseCard>
      <div>
        <div className={`${styles.wrapper}`}>
          <div className={`${styles.header}`}>
            <span>
              <FontAwesomeIcon icon={faSchool} />
              <span className={`${styles.roboto_bold} ${styles.left_margin}`}>
                {" "}
                {institute}
              </span>
            </span>
            <span className={`${styles.roboto}`}>{degree_type}</span>
            <span>
              <span></span>
              <FontAwesomeIcon icon={faLocationDot} />
              <span className={`${styles.roboto} ${styles.left_margin}`}>
                {" "}
                {location}{" "}
              </span>
            </span>
          </div>
          <div className={`${styles.header}`}>
            <span className={`${styles.roboto}`}>{course_name} </span>
            <span className={`${styles.roboto}`}>{grad_year}</span>
          </div>
        </div>
      </div>

      <div className={`${styles.roboto}`}>{description}</div>
    </BaseCard>
  );
}