import { useData } from "@/context/DataContext";
import styles from "./Footer.module.scss";

function HeartIcon() {
  return (
    <span className={styles.icon} aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="heartGradient"
            x1="12"
            y1="0"
            x2="12"
            y2="24"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#590D22" />
            <stop offset="25%" stopColor="#A4133C" />
            <stop offset="50%" stopColor="#FF4D6D" />
            <stop offset="75%" stopColor="#FFB3C1" />
            <stop offset="100%" stopColor="#FFF0F3" />
          </linearGradient>
        </defs>

        <path
          fill="url(#heartGradient)"
          d="M21.191 2.095A6.2 6.2 0 0 0 19.18.544A5.5 5.5 0 0 0 16.805 0c-.815 0-1.621.186-2.374.546A6.2 6.2 0 0 0 12.42 2.1l-.751.878-.745-.876-.005-.006A6.2 6.2 0 0 0 8.907.545A5.5 5.5 0 0 0 6.535 0a5.5 5.5 0 0 0-2.373.545a6.2 6.2 0 0 0-2.011 1.55l-.335.387C.653 3.823 0 5.642 0 7.54s.653 3.717 1.816 5.059l8.834 10.193.997 1.206.024-.028.026.03.934-1.138L21.526 12.6c1.16-1.343 1.813-3.162 1.813-5.059s-.652-3.716-1.813-5.059z"
        />
      </svg>
    </span>
  );
}

export default function Footer() {
  const { info } = useData();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.glass}>
        <span>Made with</span>
        <HeartIcon />
        <span>by {info.personal.name}</span>
        <span>·</span>
        <span>© {year}. All rights reserved.</span>
        <span>·</span>
        <span>Powered by React</span>
      </div>
    </footer>
  );
}