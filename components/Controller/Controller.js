import React from 'react'
import styles from './controller.module.css'
import ControllerLogo from '@/data/controller.svg'
import ControllerLogoInactive from '@/data/controller-inactive.svg'

export default function Controller({ isActive, onToggle }) {
  return (
    <div className={`${styles.action} ${isActive ? styles.active : ''}`} onClick={onToggle}>
      <span className={styles.activeButton}>
        {isActive ? <ControllerLogo /> : <ControllerLogoInactive />}
      </span>
    </div>
  )
}
