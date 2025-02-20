'use client'
import React, { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import ScoreboardLive from '@/components/live-game/scoreboard/scoreboardLive'
import Leaders from '@/components/live-game/leader-tabs/leaders'
import styles from './live-game.module.css'

import { liveData } from '@/data/live-data'
import { extractPurdueGame } from '@/lib/scores/scores'
import * as utils from '@/lib/utils/live-game/live-game'

// Register AG Grid modules for v33+
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
ModuleRegistry.registerModules([AllCommunityModule])

// Dynamically import AgGridReact to avoid SSR issues.
const AgGridReact = dynamic(() => import('ag-grid-react').then((mod) => mod.AgGridReact), {
  ssr: false,
})

function PurdueGame() {
  // Initialize game data from liveData.
  const [gameData, setGameData] = useState(
    liveData?.events?.find((ev) => ev.shortName?.includes('PUR')) || {}
  )

  // Extract competition and teams using our utility.
  const { competition, homeTeam, awayTeam, isGameLive } = useMemo(
    () => utils.extractTeams(gameData),
    [gameData]
  )

  // Poll for live updates if the game is in progress.
  useEffect(() => {
    let intervalId
    const fetchLiveData = async () => {
      try {
        const newGameData = await extractPurdueGame()
        if (newGameData) {
          setGameData(newGameData)
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

  // Prepare leader cards.
  const homeLeaderCards = useMemo(() => utils.getLeaderCards(homeTeam), [homeTeam])
  const awayLeaderCards = useMemo(() => utils.getLeaderCards(awayTeam), [awayTeam])

  // Build grid data and columns using our utilities.
  const rowData = useMemo(() => utils.getRowData(homeTeam, awayTeam), [homeTeam, awayTeam])
  const columnDefs = useMemo(() => utils.getColumnDefs(homeTeam, awayTeam), [homeTeam, awayTeam])

  // Basic error handling.
  if (!gameData.id) {
    return (
      <div className={styles.container}>
        <h2>No Purdue game found!</h2>
      </div>
    )
  }
  if (!competition.uid) {
    return (
      <div className={styles.container}>
        <h2>No competition data.</h2>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <ScoreboardLive homeTeam={homeTeam} awayTeam={awayTeam} competition={competition} />
      <Leaders homeLeaderCards={homeLeaderCards} awayLeaderCards={awayLeaderCards} />
      <h3 className={styles.tableHeading}>Statistics Table</h3>
      <div className={`ag-theme-alpine ${styles.gridWrapper}`}>
        <AgGridReact rowData={rowData} columnDefs={columnDefs} pagination paginationPageSize={10} />
      </div>
    </div>
  )
}

export default PurdueGame
