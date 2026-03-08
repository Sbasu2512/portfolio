import type { ReactNode } from 'react';
import styles from './basecard.module.css';

type BaseCardProps = {
  children: ReactNode;
};

export default function BaseCard({ children }: BaseCardProps) {
  return <div className={styles.card}>{children}</div>;
}
