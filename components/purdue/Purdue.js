import React from 'react'
import styles from './Purdue.module.css'
import PurdueLogo from '@/data/logo-purdue.svg'
import PurdueLogoWhite from '@/data/logo-purdue-white.svg'

export default function Purdue({ isActive, onToggle }) {
  return (
    <div className={`${styles.action} ${isActive ? styles.active : ''}`} onClick={onToggle}>
      <span className={styles.activeButton}>{isActive ? <PurdueLogoWhite /> : <PurdueLogo />}</span>
    </div>
  )
}
