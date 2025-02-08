// components/purdue/Scoreboard.js
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './Scoreboard.module.css'
import { extractPurdueGame } from '@/lib/scores/scores'
import Live from './live/Live'
import { Icons } from './consts/icons.constants'

// --- Helper Functions for Selectors and Sorting ---

const getAbbr = (team) => team?.abbreviation === 'PUR'

const sortForPurdueFirst = (arr) => arr.sort((a, b) => getAbbr(b?.team) - getAbbr(a?.team))

const getStaticSelectors = (competition) => {
  const gameInformation = {
    date: competition?.status?.type?.shortDetail,
    location: competition?.venue?.fullName,
    address: `${competition?.venue?.address?.city}, ${competition?.venue?.address?.state}`,
    watch: competition?.broadcasts?.[0]?.media?.shortName,
  }

  const competitors = competition?.competitors || []
  const sortedTeams = sortForPurdueFirst([...competitors])
  const teamInfo = sortedTeams.map((team) => ({
    name: team.team.nickname,
    rank: team.curatedRank.current,
    logo: team.team.logos[0].href,
  }))

  return { gameInformation, teamInfo }
}

const getLiveSelectors = (liveGameData) => {
  const liveCompetition = liveGameData?.competitions?.[0]
  const competitors = liveCompetition?.competitors || []
  const sortedCompetitors = sortForPurdueFirst([...competitors])
  return {
    scores: sortedCompetitors.map((comp) => comp.score),
    time: liveCompetition?.status?.type?.shortDetail,
  }
}

// --- Main Component ---

const Scoreboard = ({ purdue }) => {
  const initialCompetition = purdue?.team?.nextEvent?.[0]?.competitions?.[0] || {}

  const { gameInformation, teamInfo } = getStaticSelectors(initialCompetition)

  const [scoreboardData, setScoreboardData] = useState({
    competition: initialCompetition,
    gameInformation,
    teamInfo,
    live: null,
  })

  const isGameLive = scoreboardData.competition?.status?.type?.state === 'in'

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
      fetchLiveData()
      intervalId = setInterval(fetchLiveData, 20000)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isGameLive])

  return (
    <div className={styles.scoreboard}>
      {isGameLive && scoreboardData.live && <Live time={scoreboardData.live.time} />}

      <div className={styles.teamContainer}>
        {scoreboardData.teamInfo.map((team, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <div className={styles.divider}>
                <p>VS</p>
              </div>
            )}
            <div className={styles.team}>
              {team.logo && (
                <Image src={team.logo} alt={`${team.name} logo`} width={60} height={60} />
              )}
              <div className={styles.name}>{team.name}</div>
              <span className={styles.rank}>{Number(team.rank) <= 25 ? `#${team.rank}` : ''}</span>
              <h6 className="ml-auto p-4">
                {scoreboardData.live ? scoreboardData.live.scores[index] : null}
              </h6>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className={styles.gameContainer}>
        <div className={styles.gameAddress}>
          {Icons.Address}
          <p>{scoreboardData.gameInformation.address}</p>
        </div>
        <div className={styles.gameInfo}>
          <p className={styles.gameInfoLine}>
            {Icons.Watch} : {scoreboardData.gameInformation.watch}
          </p>
          {!isGameLive && (
            <p className={styles.gameInfoLine}>
              {Icons.Calendar} : {scoreboardData.gameInformation.date}
            </p>
          )}
          {isGameLive && scoreboardData.live && (
            <p className={styles.gameInfoLine}>
              {Icons.Time} : {scoreboardData.live.time}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Scoreboard
