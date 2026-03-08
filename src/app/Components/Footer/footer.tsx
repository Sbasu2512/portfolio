import styles from './footer.module.css';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Footer() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.flex_display}>
          <span className={styles.text_wrapper}>
            Made with{' '}
            <span className={styles.red}>
              <FontAwesomeIcon icon={faHeart} />
            </span>{' '}
            By Sayantan{' '}
          </span>
          <span className={`${styles.text_wrapper} ${styles.left}`}>
            | &copy; 2022. All rights reserved.{` `}
          </span>
          <span className={`${styles.text_wrapper} ${styles.left}`}>
            | Powered by{' '}
            <span className={styles.flex_display}>
              <img
                src="/assets/svg/next.svg"
                className={`${styles.left} ${styles.small_icon}`}
                alt="Next.js"
              />{' '}
            </span>{' '}
          </span>
        </div>
      </div>
    </div>
  );
}
