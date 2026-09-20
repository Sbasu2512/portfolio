import { useRef, useState, useEffect } from "react";
import PageShell from "@/components/PageShell/PageShell";
import CityScene from "@/components/Scene/CityScene";
import { useData } from "@/context/DataContext";
import styles from "./WorkExperiencePage.module.scss";

export default function WorkExperiencePage() {
  const { workExperience } = useData();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    function onScroll() {
      if (!el) return;
      setHasMore(el.scrollTop + el.clientHeight < el.scrollHeight - 12);
    }
    onScroll();
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <PageShell scene={<CityScene />} sceneKey="city">
      <div className="container">
        <h1 className={styles.heading}>Work Experience</h1>

        <div className={styles.panel}>
          <div className={styles.scroll} ref={scrollRef}>
            <div className={styles.timelineRail} aria-hidden="true" />
            {workExperience.map((role, i) => (
              <article className={styles.item} key={`${role.company_name}-${role.start_date}-${i}`}>
                <span className={styles.dot} aria-hidden="true" />
                <div className={styles.meta}>
                  <span>{role.start_date} — {role.end_date}</span>
                  <span>{role.location}</span>
                </div>
                <h2 className={styles.role}>{role.position}</h2>
                <p className={styles.company}>
                  <strong>{role.company_name}</strong>
                  {role.client && <span> · Client: {role.client}</span>}
                </p>
                <p className={styles.body}>{role.responsibilities}</p>
              </article>
            ))}
          </div>
          <div className={[styles.fade, hasMore ? styles.show : ""].join(" ")} aria-hidden="true">
            <span className={styles.chev} />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
