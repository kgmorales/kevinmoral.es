'use client'
import React, { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import ScoreboardLive from '@/components/live-game/scoreboardLive/scoreboardLive'
import Leaders from '@/components/live-game/leader-tabs/leaders'
import styles from './live-game.module.css'

import { liveData } from '@/data/live-data'
import { extractPurdueGame } from '@/lib/purdue'
import * as utils from '@/lib/purdue/live-game'

// Register AG Grid modules for v33+
import { AllCommunityModule, ModuleRegistry, themeQuartz, colorSchemeDark } from 'ag-grid-community'
ModuleRegistry.registerModules([AllCommunityModule])

const myTheme = themeQuartz
  .withPart(colorSchemeDark) // start with a dark color scheme
  .withParams({
    backgroundColor: '#171717',
    headerBackgroundColor: '#171717',
    headerTextColor: 'white',
    borderColor: 'rgb(64, 64, 64)',
  })

// Dynamically import AgGridReact to avoid SSR issues.
const AgGridReact = dynamic(() => import('ag-grid-react').then((mod) => mod.AgGridReact), {
  ssr: false,
})

function PurdueGame() {
  // Initialize game data from liveData.
  const [gameData, setGameData] = useState(
    liveData?.events?.find((ev) => ev.shortName?.includes('PUR')) || {}
  )

  // Extract competition and teams
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
        <AgGridReact theme={myTheme} rowData={rowData} columnDefs={columnDefs} />
      </div>
    </div>
  )
}

export default PurdueGame
