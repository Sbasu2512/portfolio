import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import styles from './card.module.css';
import BaseCard from '../Card/BaseCard';
import type { WorkExperience } from '@/types/portfolio';

type WorkCardProps = {
  work_details: WorkExperience;
};

export default function WorkCard({ work_details }: WorkCardProps) {
  const {
    company_name,
    end_date,
    responsibilities,
    location,
    position,
    start_date,
    client
  } = work_details;

  const companyName = client ? `${client}-${company_name}` : company_name;

  return (
    <BaseCard>
      <div className={styles.flex_display}>
        <div className={`${styles.card_header} ${styles.left_margin}`}>
          <span className={styles.roboto}>{companyName}</span>
          <span className={styles.roboto_bold}>{position} </span>
          <span className={styles.roboto}>
            {start_date} - {end_date}
          </span>
          <span>
            <span></span>
            <FontAwesomeIcon icon={faLocationDot} />
            <span className={`${styles.roboto} ${styles.left_margin}`}>
              {location}
            </span>
          </span>
        </div>
      </div>

      <div className={`mt-3 ${styles.roboto}`}>
        <p>{responsibilities}</p>
      </div>
    </BaseCard>
  );
}
