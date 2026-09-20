import { Link } from "react-router-dom";
import PageShell from "@/components/PageShell/PageShell";
import BlackHoleScene from "@/components/Scene/BlackHoleScene";
import { useData } from "@/context/DataContext";
import { useTypewriter } from "@/hooks/useTypewriter";
import styles from "./HomePage.module.scss";

export default function HomePage() {
  const { info } = useData();
  const typed = useTypewriter(info.personal.typewritter_words);

  return (
    <PageShell scene={<BlackHoleScene />} sceneKey="blackhole">
      <div className={[styles.hero, "container"].join(" ")}>
        <div className={styles.card}>
          <h1 className={styles.name}>{info.personal.name}</h1>
          <p className={styles.typed} aria-live="polite">
            {typed}
            <span className={styles.caret} aria-hidden="true" />
          </p>

          {/* Order mirrors the Figma hero: mail, LinkedIn, GitHub, then resume */}
          <div className={styles.socials}>
            <a href={`mailto:${info.personal.email}`} aria-label="Email">
              <MailIcon />
            </a>
            <a href={info.personal.linkedin_url} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
            <a href={info.personal.github_url} target="_blank" rel="noreferrer" aria-label="GitHub">
              <GitHubIcon />
            </a>
            <Link to={info.personal.resume} aria-label="Resume">
              <ResumeIcon />
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21H9z" />
    </svg>
  );
}
function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.26-.45-1.28.1-2.66 0 0 .84-.27 2.75 1.02a9.4 9.4 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.66.64.7 1.03 1.6 1.03 2.68 0 3.84-2.35 4.68-4.58 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}
// Matches the Material "text_snippet" glyph used for the resume icon in Figma
function ResumeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 16.5h6M9 9.5h2" />
    </svg>
  );
}
