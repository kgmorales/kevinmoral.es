import Live from '@/components/purdue/scoreboard/live/Live'
import Image from 'next/image'
import styles from './scoreboardLive.module.css'

export default function ScoreboardLive({ homeTeam, awayTeam, competition }) {
  return (
    <div className={styles.scoreboard}>
      <div className={styles.team}>
        <div className={styles.teamContainer}>
          <div className={styles.logoContainer}>
            {homeTeam.team?.logo && (
              <>
                <Image
                  src={homeTeam.team.logo}
                  alt={homeTeam.team.displayName}
                  width={125}
                  height={125}
                  className={styles.teamLogo}
                />
                <p>#{homeTeam.curatedRank.current}</p>
              </>
            )}
          </div>
          <h2 className={styles.teamName}>{homeTeam.team?.displayName}</h2>
        </div>
        <div className={styles.matchScore}>
          <p className={styles.scoreNumber}>{homeTeam.score || 0}</p>
        </div>
      </div>
      <div className={styles.matchDetails}>
        <Live />
        <div className={styles.matchTime}>{competition?.status?.displayClock || '0:00'}</div>
        <span>
          {competition?.status?.period}
          {competition?.status?.period === 1 ? 'st' : 'nd'} Half
        </span>
        <span>
          {competition?.venue?.address?.city}, {competition?.venue?.address?.state}
        </span>
      </div>
      <div className={styles.team}>
        <div className={styles.matchScore}>
          <p className={styles.scoreNumber}>{awayTeam.score || 0}</p>
        </div>
        <div className={styles.teamContainer}>
          <div className={styles.logoContainer}>
            {awayTeam.team?.logo && (
              <>
                <Image
                  src={awayTeam.team.logo}
                  alt={awayTeam.team.displayName}
                  width={125}
                  height={125}
                  className={styles.teamLogo}
                />
                <p>#{awayTeam.curatedRank.current}</p>
              </>
            )}
          </div>
          <h2 className={styles.teamName}>{awayTeam.team?.displayName}</h2>
        </div>
      </div>
    </div>
  )
}
