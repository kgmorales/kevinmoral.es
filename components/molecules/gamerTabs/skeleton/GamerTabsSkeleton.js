'use client'
import React from 'react'
import styles from './GamerTabsSkeleton.module.css'

export default function GamerTabsSkeleton() {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.skeletonAvatar}></div>
      <div className={styles.skeletonText}></div>
      <div className={styles.skeletonTextShort}></div>
      <div className={styles.skeletonIcons}>
        <div className={styles.skeletonIcon}></div>
        <div className={styles.skeletonIcon}></div>
      </div>
    </div>
  )
}
