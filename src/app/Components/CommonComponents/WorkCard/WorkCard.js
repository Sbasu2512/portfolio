import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import styles from "./card.module.css";
import BaseCard from "../Card/BaseCard";

export default function WorkCard(props) {
  const {
    company_name,
    end_date,
    responsibilities,
    location,
    company_logo,
    position,
    start_date,
    client,
  } = props.work_details;

  const company_nom = client ? `${client}-${company_name}` : company_name; ;

  return (
    <BaseCard>
      <div className={`${styles.flex_display}`}>
        <div className={`${styles.card_header} ${styles.left_margin}`}>
          <span className={`${styles.roboto}`}>{company_nom}</span>
          <span className={`${styles.roboto_bold}`}>{position} </span>
          <span className={`${styles.roboto}`}>
            {start_date} - {end_date}
          </span>
          <span>
            <span></span>
            <FontAwesomeIcon icon={faLocationDot} />
            <span className={`${styles.roboto} ${styles.left_margin}`}>
              {" "}
              {location}{" "}
            </span>
          </span>
        </div>
      </div>

      <div className={`mt-3 ${styles.roboto}`}>
        <p>{responsibilities}</p>
      </div>
    </BaseCard>
  );
}