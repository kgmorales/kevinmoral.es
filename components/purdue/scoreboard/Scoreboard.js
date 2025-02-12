// components/purdue/Scoreboard.js
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './Scoreboard.module.css'
import { extractPurdueGame } from '@/lib/scores/scores'
import Live from './live/Live'
import { Icons } from './consts/icons.constants'
import * as utils from './utils/scoreboard.utils'
import { fakeMidGame } from './consts/fakeMidGame.constants'

// --- Main Component ---

const Scoreboard = ({ purdue }) => {
  // Extract the initial competition from the prop.
  const initialCompetition = purdue?.team?.nextEvent?.[0]?.competitions?.[0] || {}

  // Build the initial view model (vm) from the competition data.
  const [vm, setVm] = useState(utils.getViewModel(initialCompetition))

  // Determine if the game is live based on the competition status.
  // const isGameLive = initialCompetition?.status?.type?.state === 'in'
  const isGameLive = true

  // Fetch live data periodically if the game is live.
  useEffect(() => {
    let intervalId

    const fetchLiveData = async () => {
      try {
        const newGameData = await extractPurdueGame()
        // const newGameData = utils.extractFakeData(fakeMidGame)

        if (newGameData) {
          const live = utils.getLiveSelectors(newGameData)
          // Update the view model with the live data.
          setVm((prevVm) => ({ ...prevVm, live }))
        }
      } catch (error) {
        console.error('Error fetching live game data:', error)
      }
    }

    if (isGameLive) {
      fetchLiveData() // Initial fetch.
      intervalId = setInterval(fetchLiveData, 20000)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isGameLive])

  return (
    <div className={styles.scoreboard}>
      {isGameLive && (
        <div className={styles.liveContainer}>
          <Live time={vm.live?.time} />
        </div>
      )}

      <div className={styles.teamContainer}>
        {vm.teamInfo.map((team, index) => (
          <React.Fragment key={index}>
            {isGameLive ? (
              <div className={styles.dividerLive}>
                <p>VS</p>
              </div>
            ) : (
              <div className={styles.dividerPreview}>
                <p>VS</p>
              </div>
            )}
            <div className={styles.team}>
              {team.logo && (
                <Image src={team.logo} alt={`${team.name} logo`} width={60} height={60} />
              )}
              <div className={styles.name}>{team.name}</div>
              <span className={styles.rank}>{Number(team.rank) <= 25 ? `#${team.rank}` : ''}</span>
              {isGameLive && <h6 className="ml-auto p-4">{vm.live?.scores[index]}</h6>}
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className={styles.gameContainer}>
        <div className={styles.gameAddress}>
          {Icons.Address}
          <p>{vm.gameInformation.address}</p>
        </div>
        <div className={styles.gameInfo}>
          <p className={styles.gameInfoLine}>
            {Icons.Watch} : {vm.gameInformation.watch}
          </p>
          {!isGameLive && (
            <p className={styles.gameInfoLine}>
              {Icons.Calendar} : {vm.gameInformation.date}
            </p>
          )}
          {isGameLive && vm.live && (
            <p className={styles.gameInfoLine}>
              {Icons.Time} : {vm.live.time}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Scoreboard
