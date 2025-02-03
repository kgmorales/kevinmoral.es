// components/purdue/Purdue.js
import React from 'react'
import styles from './Purdue.module.css'
import PurdueLogo from '@/data/logo-purdue.svg'

export default function Purdue({ purdue, isActive, onToggle }) {
  return (
    <div className={`${styles.action} ${isActive ? styles.active : ''}`} onClick={onToggle}>
      <span className={styles.activeButton}>
        <PurdueLogo />
      </span>
    </div>
  )
}
