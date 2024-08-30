import React from "react";
import styles from "./navbar.module.css";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className={`${styles.sticky_top}`}>
      <div className={`mx-2 ${styles.nav} ${styles.flex_props}`}>
        <Link href="/" className={`${styles.nav_text} ${styles.no_dec}`}>
          <div>Home</div>
        </Link>
        <Link href="/About" className={`${styles.nav_text} ${styles.no_dec}`}>
          <div>About</div>
        </Link>
        <Link href="/Work" className={`${styles.nav_text} ${styles.no_dec}`}>
          <div>Work Experience</div>
        </Link>
        <Link href="/Project" className={`${styles.nav_text} ${styles.no_dec}`}>
          <div>Projects</div>
        </Link>
      </div>
    </div>
  );
}
