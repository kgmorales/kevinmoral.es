// components/purdue/Purdue.js
import React from 'react'
import styles from './Live.module.css'

export default function Live() {
  return (
    <div className={styles.liveIndicatorHolder}>
      <span className={styles.indicator}>
        <div className={`${styles.circle} ${styles.blink}`} aria-hidden="true"></div>Live
      </span>
    </div>
  )
}
