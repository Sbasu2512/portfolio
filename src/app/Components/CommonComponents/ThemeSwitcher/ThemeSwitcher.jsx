'use client';

import { useState } from 'react';
import styles from './ThemeSwitcher.module.css';

const ThemeSwitcher = ({onChange, currentTheme}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (event) => {
    if(onChange){
      onChange(event.currentTarget.id)
    }
    setIsOpen(false);
  }

  return (
    <div 
      className={styles.menu_container} 
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className={styles.menu_button}>Themes</button>
      {isOpen && (
        <div className={styles.menu_dropdown}>
           <span onClick={handleThemeChange} id="purple" className={`${styles.text_purple} ${styles.flex}`}><div className={styles.purple}></div> <p>Purple</p></span>
           <span onClick={handleThemeChange} id="light" className={`${styles.text_light} ${styles.flex}`}><div className={styles.light}></div> <p>Light</p></span>
           <span onClick={handleThemeChange} id="dark" className={`${styles.text_dark} ${styles.flex}`}> <div className={styles.dark}></div> <p>Dark</p></span>
           {/* <span onClick={handleThemeChange} id="red" className={`${styles.text_red} ${styles.flex}`}> <div className={styles.red}></div> <p>Red</p></span> */}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
