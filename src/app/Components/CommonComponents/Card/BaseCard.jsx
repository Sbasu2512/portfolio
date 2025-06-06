import React from "react";
import Styles from './basecard.module.css';

export default function BaseCard({children}) {
    return (
        <div className={Styles.card}>{children}</div>
    );
}