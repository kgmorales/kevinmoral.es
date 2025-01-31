import React, { useState } from 'react'
import styles from './Purdue.module.css'
import PurdueLogo from '@/data/logo-purdue.svg'
import Scoreboard from './scoreboard/Scoreboard'

export default function Purdue({ purdue }) {
  const [isActive, setIsActive] = useState(false)

  const handleToggle = () => {
    setIsActive((prev) => !prev)
  }

  return (
    <div className={`${styles.action} ${isActive ? styles.active : ''}`} onClick={handleToggle}>
      <span className={`${styles.activeButton}`}>
        <PurdueLogo />
      </span>
      <div className={`${styles.scoreBoardContainer}`}>
        <Scoreboard purdue={purdue} />
      </div>
    </div>
  )
}
