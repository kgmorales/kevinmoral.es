import Image from 'next/image'
import styles from './leader-bio.module.css'

export default function LeaderBio({ leader }) {
  const position = leader.athlete?.position?.abbreviation || ''
  const playerNumber = leader.athlete?.jersey || ''
  return (
    <div className={styles.player}>
      <div className={styles.playerInfo}>
        <h2 className={styles.playerName}>{leader.athleteName}</h2>
        <dl className={styles.playerStats}>
          {Object.entries(leader.stats).map(([stat, value]) => (
            <div key={stat}>
              <dt className={styles.playerStat}>{stat}</dt>
              <dd className={styles.playerStatNumber}>
                {Array.isArray(value) ? value.join(', ') : value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className={styles.playerImage}>
        {playerNumber && <span className={styles.playerNumber}>#{playerNumber}</span>}
        {position && <span className={styles.badge}>{position}</span>}
        <Image src={leader.athleteImage} alt={leader.athleteName} width={150} height={150} />
      </div>
    </div>
  )
}
