// components/purdue/Scoreboard.js
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './Scoreboard.module.css'
import { extractPurdueGame } from '@/lib/scores/scores'
import Live from './live/Live'

// Helper function to compute the static selectors from competition
const getStaticSelectors = (competition) => {
  const gameInformation = {
    date: competition?.status?.type?.shortDetail,
    location: competition?.venue?.fullName,
    address: `${competition?.venue?.address?.city}, ${competition?.venue?.address?.state}`,
    watch: competition?.broadcasts?.[0]?.media?.shortName,
  }

  const competitors = competition?.competitors || []
  const purdueTeam = competitors[0] || {}
  const awayTeam = competitors[1] || {}

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

  return { gameInformation, purdueInfo, awayInfo }
}

// Helper function to compute the live selectors from live game data
const getLiveSelectors = (liveGameData) => {
  const liveCompetition = liveGameData?.competitions?.[0]
  return {
    homeScore: liveCompetition?.competitors?.[0]?.score,
    awayScore: liveCompetition?.competitors?.[1]?.score,
    time: liveCompetition?.status?.type?.shortDetail,
  }
}

const Scoreboard = ({ purdue }) => {
  // Extract the competition from the purdue prop.
  const initialCompetition = purdue?.team?.nextEvent?.[0]?.competitions?.[0] || {}

  // Build initial selectors from the competition data.
  const { gameInformation, purdueInfo, awayInfo } = getStaticSelectors(initialCompetition)

  // hold selectors
  const [scoreboardData, setScoreboardData] = useState({
    competition: initialCompetition,
    gameInformation,
    purdueInfo,
    awayInfo,
    // live will hold { homeScore, awayScore, time } when available.
    live: null,
  })

  // Determine if the game is live based on the competition status.
  const isGameLive = scoreboardData.competition?.status?.type?.state === 'in'

  // Fetch live data every 5 seconds if the game is live.
  useEffect(() => {
    let intervalId

    const fetchLiveData = async () => {
      try {
        const newGameData = await extractPurdueGame()
        if (newGameData) {
          const live = getLiveSelectors(newGameData)
          setScoreboardData((prev) => ({
            ...prev,
            live,
          }))
        }
      } catch (error) {
        console.error('Error fetching live game data:', error)
      }
    }

    if (isGameLive) {
      fetchLiveData() // Initial fetch on mount.
      intervalId = setInterval(fetchLiveData, 5000)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isGameLive])

  return (
    <div className={styles.scoreboard}>
      {isGameLive && scoreboardData.live && <Live time={scoreboardData.live.time} />}
      <div className={styles.teamContainer}>
        <div className={styles.team}>
          {scoreboardData.purdueInfo.logo && (
            <Image src={scoreboardData.purdueInfo.logo} alt="Purdue logo" width={60} height={60} />
          )}
          <div className={styles.name}>{scoreboardData.purdueInfo.name}</div>
          <span className={styles.rank}>
            {Number(scoreboardData.purdueInfo.rank) <= 25
              ? `#${scoreboardData.purdueInfo.rank}`
              : ''}
          </span>
          <h6 className="ml-auto p-4">
            {scoreboardData.live ? scoreboardData.live.homeScore : null}
          </h6>
        </div>
        <div className={styles.divider}>
          <p>VS</p>
        </div>
        <div className={styles.team}>
          {scoreboardData.awayInfo.logo && (
            <Image src={scoreboardData.awayInfo.logo} alt="Away team logo" width={60} height={60} />
          )}
          <div className={styles.name}>{scoreboardData.awayInfo.name}</div>
          <span className={styles.rank}>
            {Number(scoreboardData.awayInfo.rank) <= 25 ? scoreboardData.awayInfo.rank : ''}
          </span>
          <h6 className="ml-auto p-4">
            {scoreboardData.live ? scoreboardData.live.awayScore : null}
          </h6>
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
          <p>{scoreboardData.gameInformation.address}</p>
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
            : {scoreboardData.gameInformation.watch}
          </p>
          {!isGameLive && (
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
              : {scoreboardData.gameInformation.date}
            </p>
          )}
          {isGameLive && scoreboardData.live && (
            <p className={styles.gameInfoLine}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              : {scoreboardData.live.time}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Scoreboard
