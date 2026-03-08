'use client';

import styles from './navbar.module.css';
import Link from 'next/link';
import Image from 'next/image';
import ThemeSwitcher from '../CommonComponents/ThemeSwitcher/ThemeSwitcher';
import { useTheme } from '@/app/context/ThemeContext';

export default function Navbar() {
  const { activeTheme, handleChange } = useTheme();

  return (
    <div className={styles.sticky_top}>
      <div className={`mx-2 ${styles.nav} ${styles.flex_props}`}>
        <Link href="#">
          <span>
            <Image
              src="/assets/logo/home.png"
              alt="home"
              width={48}
              height={48}
              className={styles.nav_logo}
            />
          </span>
        </Link>
        <div>
          <ThemeSwitcher onChange={handleChange} currentTheme={activeTheme} />
        </div>
        <Link href="#project">
          <span>
            <Image src="/assets/logo/project.gif" alt="project" width={48} height={48} />
          </span>
        </Link>
      </div>
    </div>
  );
}
