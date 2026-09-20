import { useEffect, useRef, useState } from "react";
import PageShell from "@/components/PageShell/PageShell";
import HarborScene from "@/components/Scene/HarborScene";
import { useData } from "@/context/DataContext";
import styles from "./EducationPage.module.scss";

export default function EducationPage() {
  const { info } = useData();
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
    <PageShell scene={<HarborScene />} sceneKey="harbor">
      <div className="container">
        <h1 className={styles.heading}>Education</h1>
        <div className={styles.panel}>
          <div className={styles.scroll} ref={scrollRef}>
            <div className={styles.timelineRail} aria-hidden="true" />
            {info.education.map((item) => (
              <article className={styles.item} key={`${item.institute}-${item.grad_year}`}>
                <span className={styles.dot} aria-hidden="true" />
                <div className={styles.year}>{item.grad_year}</div>
                <h2 className={styles.course}>{item.course_name}</h2>
                <p className={styles.meta}>{item.degree_type} · {item.institute} · {item.location}</p>
                <p className={styles.body}>{item.description}</p>
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
