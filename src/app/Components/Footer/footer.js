import React from "react";
import styles from './footer.module.css';
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const footerMessage = {
  web: "&copy; 2022 All rights reserved. Designed and developed with care.",
  tab: "&copy; 2022 All rights reserved. Crafted with dedication and professionalism.",
  phone: "&copy; 2022 All rights reserved. Sayantan Basu",
};

export default function Footer() {
  return (
    <div className={styles.container}>
      <div className={`${styles.wrapper}`}>
        <div className={styles.flex_display}>
          <span className={styles.text_wrapper}>
            Made with{" "}
            <span className={`${styles.red}`}>
              {" "}
              <FontAwesomeIcon icon={faHeart} />
            </span>{" "}
            By Sayantan{" "}
          </span>
          <span className={`${styles.text_wrapper} ${styles.left}`}>
            | &copy; 2022. All rights reserved.{" "}
          </span>
          <span className={`${styles.text_wrapper} ${styles.left}`}>
            | Powered by{" "}
            <span className={styles.flex_display}>
              <img
                src="/assets/svg/next.svg"
                className={`${styles.left} ${styles.small_icon}`}
              />{" "}
            </span>{" "}
          </span>
        </div>
      </div>
    </div>
  );
}