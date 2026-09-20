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

function ReactIcon() {
  return (
    <span className={styles.icon} aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path fill="url(#a)" d="M12 13.03a1.785 1.785 0 1 0 0-3.57 1.785 1.785 0 0 0 0 3.57" />
      <path fill="url(#b)" d="m7.002 14.794-.395-.101c-2.934-.741-4.617-2.001-4.617-3.452S3.674 8.53 6.607 7.789l.395-.1.111.391a19.5 19.5 0 0 0 1.136 2.983l.085.178-.085.178c-.46.963-.841 1.961-1.136 2.985zm-.577-6.095c-2.229.628-3.598 1.586-3.598 2.542 0 .954 1.368 1.913 3.598 2.54q.41-1.304.985-2.54a20 20 0 0 1-.985-2.542m10.572 6.095-.11-.392a19.6 19.6 0 0 0-1.137-2.984l-.085-.177.085-.179c.46-.961.839-1.96 1.137-2.984l.11-.39.395.1c2.935.741 4.617 2 4.617 3.453s-1.683 2.711-4.617 3.452zm-.41-3.553c.4.866.733 1.718.987 2.54 2.23-.627 3.599-1.586 3.599-2.54 0-.956-1.368-1.913-3.599-2.542a21 21 0 0 1-.987 2.542" />
      <path fill="url(#c)" d="m6.419 8.695-.11-.39c-.826-2.908-.576-4.991.687-5.717 1.235-.715 3.222.13 5.303 2.265l.284.292-.284.291a20 20 0 0 0-2.02 2.474l-.113.162-.196.016c-1.064.084-2.12.254-3.157.509zm1.582-5.529q-.337 0-.589.145c-.828.477-.974 2.138-.404 4.38q1.337-.297 2.696-.417a21 21 0 0 1 1.713-2.123c-1.303-1.267-2.533-1.985-3.416-1.985m7.997 16.984c-1.188 0-2.714-.896-4.298-2.522l-.283-.291.283-.29a20 20 0 0 0 2.021-2.477l.112-.16.194-.019a19.5 19.5 0 0 0 3.158-.507l.395-.1.111.391c.822 2.906.573 4.992-.688 5.718a2 2 0 0 1-1.005.257m-3.415-2.82c1.302 1.267 2.533 1.986 3.415 1.986q.339-.001.589-.145c.829-.478.976-2.142.404-4.384q-1.335.299-2.698.419a20.5 20.5 0 0 1-1.71 2.124" />
      <path fill="url(#d)" d="m17.58 8.695-.395-.099a19.5 19.5 0 0 0-3.158-.509l-.194-.017-.112-.162A19.6 19.6 0 0 0 11.7 5.434l-.283-.291.283-.29c2.08-2.134 4.066-2.979 5.303-2.265 1.262.727 1.513 2.81.688 5.717zm-3.287-1.421c.954.085 1.858.228 2.698.417.571-2.242.425-3.903-.404-4.381-.824-.477-2.375.253-4.004 1.841q.926 1.005 1.71 2.123M8.001 20.15a2 2 0 0 1-1.005-.257c-1.263-.726-1.513-2.811-.688-5.718l.108-.391.395.1c.964.243 2.026.414 3.158.507l.194.019.113.16c.604.878 1.28 1.707 2.02 2.477l.284.29-.284.291c-1.583 1.627-3.109 2.522-4.295 2.522m-.993-5.362c-.57 2.242-.424 3.906.404 4.384.825.47 2.371-.255 4.005-1.842a21 21 0 0 1-1.713-2.123q-1.362-.12-2.696-.419" />
      <path fill="url(#e)" d="M12 15.313c-.687 0-1.392-.029-2.1-.088l-.196-.017-.113-.162a26 26 0 0 1-1.126-1.769 26 26 0 0 1-.971-1.859l-.084-.177.084-.179q.448-.948.971-1.858c.347-.596.726-1.192 1.126-1.77l.113-.16.196-.018a25 25 0 0 1 4.198 0l.194.019.113.16a25 25 0 0 1 2.1 3.628l.083.179-.083.177a25 25 0 0 1-2.1 3.628l-.113.162-.194.017c-.706.057-1.412.087-2.098.087m-1.834-.904c1.235.093 2.433.093 3.667 0a24.5 24.5 0 0 0 1.832-3.168 24 24 0 0 0-1.832-3.168 24 24 0 0 0-3.667 0 24 24 0 0 0-1.832 3.168 25 25 0 0 0 1.832 3.168" />
      <defs>
        <linearGradient id="a" x1="12" x2="12" y1="9.46" y2="13.03" gradientUnits="userSpaceOnUse">
          <stop stop-color="#00A6FB" />
          <stop offset=".25" stop-color="#0582CA" />
          <stop offset=".5" stop-color="#006494" />
          <stop offset=".75" stop-color="#003554" />
          <stop offset="1" stop-color="#051923" />
        </linearGradient>
        <linearGradient id="b" x1="11.999" x2="11.999" y1="7.688" y2="14.794" gradientUnits="userSpaceOnUse">
          <stop stop-color="#00A6FB" />
          <stop offset=".25" stop-color="#0582CA" />
          <stop offset=".5" stop-color="#006494" />
          <stop offset=".75" stop-color="#003554" />
          <stop offset="1" stop-color="#051923" />
        </linearGradient>
        <linearGradient id="c" x1="11.999" x2="11.999" y1="2.339" y2="20.15" gradientUnits="userSpaceOnUse">
          <stop stop-color="#00A6FB" />
          <stop offset=".25" stop-color="#0582CA" />
          <stop offset=".5" stop-color="#006494" />
          <stop offset=".75" stop-color="#003554" />
          <stop offset="1" stop-color="#051923" />
        </linearGradient>
        <linearGradient id="d" x1="11.999" x2="11.999" y1="2.339" y2="20.15" gradientUnits="userSpaceOnUse">
          <stop stop-color="#00A6FB" />
          <stop offset=".25" stop-color="#0582CA" />
          <stop offset=".5" stop-color="#006494" />
          <stop offset=".75" stop-color="#003554" />
          <stop offset="1" stop-color="#051923" />
        </linearGradient>
        <linearGradient id="e" x1="11.999" x2="11.999" y1="7.168" y2="15.313" gradientUnits="userSpaceOnUse">
          <stop stop-color="#00A6FB" />
          <stop offset=".25" stop-color="#0582CA" />
          <stop offset=".5" stop-color="#006494" />
          <stop offset=".75" stop-color="#003554" />
          <stop offset="1" stop-color="#051923" />
        </linearGradient>
      </defs>
    </svg>
    </span>
  )
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
        <span>Powered by </span>
        <ReactIcon />
      </div>
    </footer>
  );
}