import React from 'react'
import styles from './Scoreboard.module.css'
import Image from 'next/image'
import MapIcon from '@heroicons/react/solid/MapIcon'

export default function Scoreboard({ purdue }) {
  const gameInfo = purdue?.team?.nextEvent[0]?.competitions[0].competitors

  const purdueTeam = gameInfo[0]
  const awayTeam = gameInfo[1]

  const purdueInfo = {
    name: purdueTeam?.team.nickname,
    rank: purdueTeam?.curatedRank?.current,
    logo: purdueTeam?.team.logos[0].href,
  }
  const awayInfo = {
    name: awayTeam?.team.nickname,
    rank: awayTeam?.curatedRank?.current,
    logo: awayTeam?.team.logos[0].href,
  }

  const game = purdue?.team?.nextEvent[0]?.competitions[0]

  const gameInformation = {
    date: game.status.type.shortDetail,
    location: game.venue.fullName,
    address: `${game.venue.address.city}, ${game.venue.address.state}`,
    watch: `${game.broadcasts[0].media.shortName}`,
  }

  return (
    <div className={styles.scoreboard}>
      <div className={styles.teamContainer}>
        <div className={styles.team}>
          {purdueInfo.logo && (
            <Image src={purdueInfo.logo} alt="purdue logo" width={60} height={60} />
          )}
          <div className={styles.name}>{purdueInfo?.name}</div>
          <span className={`${styles.rank}`}>
            {Number(purdueInfo.rank) <= 25 ? `#${purdueInfo.rank}` : ''}
          </span>
        </div>
        <div className={styles.divider}>
          <p>VS</p>
        </div>
        <div className={styles.team}>
          {awayInfo.logo && <Image src={awayInfo.logo} alt="purdue logo" width={60} height={60} />}
          <div className={styles.name}>{awayInfo.name}</div>
          <span className={`${styles.rank}`}>
            {Number(awayInfo.rank) <= 25 ? `${awayInfo.rank}` : ''}
          </span>
        </div>
      </div>
      <div className={styles.gameContainer}>
        <div className={styles.gameAddress}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              clipRule="evenodd"
            />
          </svg>
          <p>{gameInformation.address}</p>
        </div>
        <div className={styles.gameInfo}>
          <p className={styles.gameInfoLine}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" />
            </svg>
            : {gameInformation.watch}
          </p>
          <p className={styles.gameInfoLine}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
              <path
                fillRule="evenodd"
                d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
                clipRule="evenodd"
              />
            </svg>
            :{gameInformation.date}
          </p>
        </div>
      </div>
    </div>
  )
}
