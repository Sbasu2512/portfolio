"use client";
import LandingPage from "./Components/Home/home";
import Bio from "./Components/Bio/bio";
import Project from "./Project/page";
import Work from "./Work/page";
import Footer from "./Components/Footer/footer";
import styles from "./page.module.css";
import { useTheme } from "./context/ThemeContext";
import { useState, useEffect } from "react";

export default function Home() {
  const { activeTheme, windowWidth } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const width = mounted ? windowWidth : undefined;

  return (
    <main className={`${styles.container}`}>
      <LandingPage theme={activeTheme} windowWidth={width} />
      <Bio theme={activeTheme} windowWidth={width} />
      <Work theme={activeTheme} windowWidth={width} />
      <Project theme={activeTheme} windowWidth={width} />
      <Footer theme={activeTheme} windowWidth={width} />
    </main>
  );
}
