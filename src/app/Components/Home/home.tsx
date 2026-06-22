'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './home.module.css';
import { Typewriter } from 'react-simple-typewriter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faFile, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import type { Theme } from '@/app/context/ThemeContext';

type LandingPageProps = {
  theme: Theme;
  windowWidth?: number;
};

type AvatarItem = {
  src: string;
  index: number;
};

const avatars: Record<Theme, AvatarItem[]> = {
  purple: [{ src: 'assets/images/avatars/purple_av.png', index: 0 }, { src: 'assets/images/avatars/purple_av_2.png', index: 1 }],
  light: [{ src: 'assets/images/avatars/light_av.png', index: 0 }, { src: 'assets/images/avatars/light_av_2.png', index: 1 }],
  dark: [{ src: 'assets/images/avatars/dark_av.png', index: 0 }, { src: 'assets/images/avatars/dark_av_2.png', index: 1 }],
  glass: [{ src: 'assets/images/avatars/dark_av.png', index: 0 }, { src: 'assets/images/avatars/dark_av_2.png', index: 1 }]
};

const ROTATION_INTERVAL_MS = 10 * 1000;

export default function LandingPage({ theme, windowWidth }: LandingPageProps) {
  const avatarList = useMemo(() => avatars[theme], [theme]);
  const shouldHideContact = (windowWidth ?? 0) < 500;
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % avatarList.length);
        setFade(true);
      }, 500);
    }, ROTATION_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [avatarList]);

  useEffect(() => {
    setIndex(0);
  }, [theme]);
  return (
    <div className={styles.container} id="#">
      <div className={styles.wrapper}>
        <div className={styles.avatar}>
          <div className={styles.circle}>
            {<img
              src={avatarList[index].src}
              className={avatarList[index].index === 0 ? styles.av_img : styles.av_img_2}
              style={{ opacity: fade ? 1 : 0 }}
              alt="Avatar"
            />}
          </div>
        </div>
        <div className={styles.accent}>
          <span>
            <h1 className={styles.playfair_display_header}>Sayantan Basu</h1>
          </span>
          <span className={styles.playfair_display}>
            <Typewriter
              words={[
                'Full-Stack Developer',
                'Front-End Developer',
                'Backend-Developer',
                'MERN Stack Developer',
                'PERN Stack Developer'
              ]}
              loop={0}
              cursor={true}
              cursorBlinking={true}
            />
          </span>
        </div>
        <div className={styles.socials_container}>
          <div className={styles.socials}>
            <div>
              <a href="https://www.linkedin.com/in/sayantan-basu-73ab4a92/" target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faLinkedin} className={styles.icon_social} />
              </a>
            </div>
            <div>
              <a href="https://github.com/Sbasu2512" target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faGithub} className={styles.icon_social} />
              </a>
            </div>
            <div>
              <a
                href="https://drive.google.com/file/d/1xkp7TN_EyH2v4osM4e7q3H42vqk4Ds2x/preview"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.text_no_dec}
              >
                <FontAwesomeIcon icon={faFile} className={styles.icon_social} />
              </a>
            </div>
          </div>
          {!shouldHideContact ? (
            <div className={styles.contact}>
              <div className={styles.contact_wrapper}>
                <span>
                  <a href="mailto:sayantanworks@gmail.com" className={styles.text}>
                    Get in touch
                  </a>
                </span>
                <FontAwesomeIcon icon={faArrowRight} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
