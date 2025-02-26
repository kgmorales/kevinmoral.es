'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './Scoreboard.module.css'
import Live from './live/Live'
import { Icons } from './consts/icons.constants'
import * as utils from './utils/scoreboard.utils'
import { getPurdue, extractPurdueGame } from '@/lib/purdue'

const Scoreboard = () => {
  // Local state for initial Purdue data.
  const [purdue, setPurdue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Local state for our view model.
  const [vm, setVm] = useState(null)

  // Fetch initial Purdue data on mount.
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const data = await getPurdue()
        setPurdue(data)
        // Extract the initial competition from the fetched data.
        const initialCompetition = data?.team?.nextEvent?.[0]?.competitions?.[0] || {}
        // Build the view model from the competition data.
        setVm(utils.getViewModel(initialCompetition))
        setLoading(false)
      } catch (err) {
        console.error('Error fetching initial Purdue data:', err)
        setError(err.message)
        setLoading(false)
      }
    }
    fetchInitialData()
  }, [])

  // Determine if the game is live.
  const isGameLive = purdue?.team?.nextEvent?.[0]?.competitions?.[0]?.status?.type?.state === 'in'

  // For mapping purposes, supply fallback values so that the layout always renders.
  const teamInfo = loading ? [{}, {}] : vm.teamInfo
  const gameInformation = loading ? {} : vm.gameInformation

  // Poll live data periodically if the game is live.
  useEffect(() => {
    if (!isGameLive || !vm) return
    let intervalId
    async function fetchLiveData() {
      try {
        const newGameData = await extractPurdueGame()
        if (newGameData) {
          const live = utils.getLiveSelectors(newGameData)
          setVm((prevVm) => ({ ...prevVm, live }))
        }
      } catch (error) {
        console.error('Error fetching live game data:', error)
      }
    }
    fetchLiveData() // Initial fetch.
    intervalId = setInterval(fetchLiveData, 20000)
    return () => clearInterval(intervalId)
  }, [isGameLive, vm])

  if (error) {
    return <p>Error: {error}</p>
  }

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className={styles.scoreboard}>
          {/* Live Container */}
          {isGameLive && (
            <div className={styles.liveContainer}>
              {loading || !vm?.live ? (
                <div className={styles.skeletonLive}></div>
              ) : (
                <Live time={vm.live.time} />
              )}
            </div>
          )}

          {/* Teams */}
          <div className={styles.teamContainer}>
            {teamInfo.map((team, index) => (
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
                  {/* Team Logo */}
                  {loading || !team.logo ? (
                    <div className={styles.skeletonAvatar}></div>
                  ) : (
                    <Image src={team.logo} alt={`${team.name} logo`} width={60} height={60} />
                  )}
                  {/* Team Name */}
                  <div className={styles.name}>
                    {loading || !team.name ? (
                      <div className={styles.skeletonText}></div>
                    ) : (
                      team.name
                    )}
                  </div>
                  {/* Team Rank */}
                  <span className={styles.rank}>
                    {loading ? (
                      <div className={styles.skeletonRank}></div>
                    ) : (
                      Number(team.rank) < 25 && `#${team.rank}`
                    )}
                  </span>
                  {/* Live Score (if game is live) */}
                  {isGameLive &&
                    (loading || !vm?.live ? (
                      <div className={styles.skeletonScore}></div>
                    ) : (
                      <h6 className="ml-auto p-4">{vm.live.scores[index]}</h6>
                    ))}
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Game Information */}
          <div className={styles.gameContainer}>
            <div className={styles.gameAddress}>
              {loading ? <span className={styles.skeletonIcon}></span> : Icons.Address}
              {loading ? (
                <p>
                  <span className={styles.skeletonText}></span>
                </p>
              ) : (
                <p>{gameInformation.address}</p>
              )}
            </div>
            <div className={styles.gameInfo}>
              <p className={styles.gameInfoLine}>
                {Icons.Watch} :{' '}
                {loading ? (
                  <span className={styles.skeletonText}></span>
                ) : (
                  `${gameInformation.watch}`
                )}
              </p>
              {!isGameLive && (
                <p className={styles.gameInfoLine}>
                  {Icons.Calendar} :{' '}
                  {loading ? (
                    <span className={styles.skeletonText}></span>
                  ) : (
                    `${gameInformation.date}`
                  )}
                </p>
              )}
              {isGameLive && vm?.live && (
                <p className={styles.gameInfoLine}>
                  {Icons.Time} :{' '}
                  {loading ? <span className={styles.skeletonText}></span> : `${vm.live.time}`}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Scoreboard
