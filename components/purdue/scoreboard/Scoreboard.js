// components/purdue/Scoreboard.js
import React, { useState, useEffect } from 'react'
import styles from './Scoreboard.module.css'
import Image from 'next/image'
import GameTable from './GameTable'
import { extractPurdueGame } from '@/lib/scores/scores'
import Live from './live/Live'

export default function Scoreboard({ purdue }) {
  // Determine if the game is live (status.type.state === 'in')
  const isGameLive = purdue?.team?.nextEvent?.[0]?.status?.type?.state === 'in'
  // const isGameLive = true
  // For static display (when game isn’t live), extract game information:
  const game = purdue?.team?.nextEvent?.[0]?.competitions?.[0]
  const gameInformation = {
    date: game?.status?.type?.shortDetail,
    location: game?.venue?.fullName,
    address: `${game?.venue?.address?.city}, ${game?.venue?.address?.state}`,
    watch: game?.broadcasts?.[0]?.media?.shortName,
  }

  // Team info for display above the game table / static info.
  const competitors = game?.competitors || []
  const purdueTeam = competitors[0]
  const awayTeam = competitors[1]

  const purdueInfo = {
    name: purdueTeam?.team?.nickname,
    rank: purdueTeam?.curatedRank?.current,
    logo: purdueTeam?.team?.logos?.[0]?.href,
  }
  const awayInfo = {
    name: awayTeam?.team?.nickname,
    rank: awayTeam?.curatedRank?.current,
    logo: awayTeam?.team?.logos?.[0]?.href,
  }

  // Local state to hold the live game data
  const [liveGameData, setLiveGameData] = useState(null)

  // If the game is live, fetch updated game data every 5 seconds.
  useEffect(() => {
    let intervalId

    async function fetchLiveData() {
      try {
        const newGameData = await extractPurdueGame()
        if (newGameData) {
          setLiveGameData(newGameData)
        }
      } catch (error) {
        console.error('Error fetching live game data:', error)
      }
    }

    if (isGameLive) {
      // Fetch immediately on mount
      fetchLiveData()
      // Set up a 5-second interval to refresh the data
      intervalId = setInterval(fetchLiveData, 5000)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isGameLive])

  const homeScoreData = liveGameData?.competitions[0]?.competitors[0]?.score
  const awayScoreData = liveGameData?.competitions[0]?.competitors[1]?.score

  return (
    <div className={styles.scoreboard}>
      {isGameLive && <Live />}
      <div className={styles.teamContainer}>
        <div className={styles.team}>
          {purdueInfo.logo && (
            <Image src={purdueInfo.logo} alt="Purdue logo" width={60} height={60} />
          )}
          <div className={styles.name}>{purdueInfo.name}</div>
          <span className={styles.rank}>
            {Number(purdueInfo.rank) <= 25 ? `#${purdueInfo.rank}` : ''}
          </span>
          <h6 className="ml-auto p-4">{homeScoreData}</h6>
        </div>
        <div className={styles.divider}>
          <p>VS</p>
        </div>
        <div className={styles.team}>
          {awayInfo.logo && (
            <Image src={awayInfo.logo} alt="Away team logo" width={60} height={60} />
          )}
          <div className={styles.name}>{awayInfo.name}</div>
          <span className={styles.rank}>
            {Number(awayInfo.rank) <= 25 ? `${awayInfo.rank}` : ''}
          </span>
          <h6 className="ml-auto p-4">{awayScoreData}</h6>
        </div>
      </div>
      {/* {isGameLive ? (
        // When live, render the live-updating GameTable with the live game data.
        // Note: The GameTable component should be updated to accept a `gameData` prop.
        <div className={styles.gameContainer}>
          <GameTable gameData={liveGameData} />
        </div>
      ) : ( */}
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
      {/* )} */}
    </div>
  )
}
