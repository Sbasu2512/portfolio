"use client";

import LandingPage from "./Components/Home/home";
import Bio from "./Components/Bio/bio";
import Project from "./Project/page";
import Work from "./Work/page";
import Footer from "./Components/Footer/footer";
import styles from "./page.module.css";
import { useTheme } from "./context/ThemeContext";
import { useEffect } from "react";

export default function Home() {
  const { activeTheme, windowWidth } = useTheme();

  return (
    <main className={`${styles.container}`}>
      <LandingPage theme={activeTheme} windowWidth={windowWidth} />
      <Bio theme={activeTheme} windowWidth={windowWidth} />
      <Work />
      <Project />
      <Footer />
    </main>
  );
}
