import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faSchool } from "@fortawesome/free-solid-svg-icons";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardActionArea } from "@mui/material";
import styles from "./educationCard.module.css";

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
    <Card
      sx={{
        width: "100%",
        zIndex: 0,
        backgroundColor: "#f8c786",
        borderRadius: "1rem",
      }}
    >
      <CardActionArea>
        <CardContent>
          <div>
            <div className={`${styles.wrapper}`}>
              <div className={`${styles.header}`}>
                <span>
                  <FontAwesomeIcon icon={faSchool} />
                  <span
                    className={`${styles.roboto_bold} ${styles.left_margin}`}
                  >
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

          <div className={`mt-3 ${styles.roboto}`}>{description}</div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
