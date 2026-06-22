'use client';

import { useState, type MouseEvent } from 'react';
import styles from './ThemeSwitcher.module.css';
import type { Theme } from '@/app/context/ThemeContext';

type ThemeSwitcherProps = {
  onChange?: (theme: Theme) => void;
  currentTheme: Theme;
};

const ThemeSwitcher = ({ onChange, currentTheme }: ThemeSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (event: MouseEvent<HTMLSpanElement>) => {
    const nextTheme = event.currentTarget.id as Theme;
    if (onChange) {
      onChange(nextTheme);
    }
    setIsOpen(false);
  };

  return (
    <div
      className={styles.menu_container}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      data-theme={currentTheme}
    >
      <button className={styles.menu_button}>Themes</button>
      {isOpen && (
        <div className={styles.menu_dropdown}>
          <span onClick={handleThemeChange} id="purple" className={`${styles.text_purple} ${styles.flex}`}><div className={styles.purple}></div> <p>Purple</p></span>
          <span onClick={handleThemeChange} id="light" className={`${styles.text_light} ${styles.flex}`}><div className={styles.light}></div> <p>Light</p></span>
          <span onClick={handleThemeChange} id="dark" className={`${styles.text_dark} ${styles.flex}`}><div className={styles.dark}></div> <p>Dark</p></span>
          <span onClick={handleThemeChange} id="glass" className={`${styles.text_glass} ${styles.flex}`}><div className={styles.glass}></div> <p>Liquid</p></span>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
