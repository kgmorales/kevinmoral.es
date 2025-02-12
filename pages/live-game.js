'use client'
import React, { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import styles from './live-game.module.css'

// Register AG Grid modules for v33+
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
ModuleRegistry.registerModules([AllCommunityModule])

// Dynamically import AgGridReact to avoid SSR issues in Next.js:
const AgGridReact = dynamic(() => import('ag-grid-react').then((mod) => mod.AgGridReact), {
  ssr: false,
})

// Import your initial live data from your constant file:
import { liveData } from '@/data/purdue-live-data'
// Import the live extractor function:
import { extractPurdueGame } from '@/lib/scores/scores'

function PurdueGame() {
  // Initialize state from the live data constant (filtering for the Purdue game by id)
  const [gameData, setGameData] = useState(
    liveData?.events?.find((ev) => ev.id === '401721401') || {}
  )

  // Derive the competition data from gameData.
  const competition = useMemo(() => {
    return gameData?.competitions?.[0] || {}
  }, [gameData])

  // Derive competitors (home and away) from the competition.
  const competitors = useMemo(() => {
    return competition?.competitors || []
  }, [competition])
  const homeTeam = competitors[0] || {}
  const awayTeam = competitors[1] || {}

  // Determine if the game is live based on the competition status.
  const isGameLive = competition?.status?.type?.state === 'in'

  // Periodically fetch live data if the game is live.
  useEffect(() => {
    let intervalId
    const fetchLiveData = async () => {
      try {
        const newGameData = await extractPurdueGame()
        if (newGameData) {
          // Update the gameData state so that all computed values (competition, etc.) update.
          setGameData(newGameData)
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

  // Helper: Aggregate leader data so that each athlete appears only once with all the categories they lead.
  function getLeaderCards(competitor) {
    const leaderMap = {}
    if (!competitor?.leaders) return []
    competitor.leaders.forEach((catObj) => {
      const categoryName = catObj.displayName || catObj.name
      ;(catObj.leaders || []).forEach((ld) => {
        if (!ld) return
        const { athlete, displayValue } = ld
        if (!athlete) return
        const athleteId = athlete.id
        if (!leaderMap[athleteId]) {
          leaderMap[athleteId] = {
            teamName: competitor.team?.displayName || 'Unknown Team',
            athleteName: athlete.displayName || 'Unknown',
            athleteImage: athlete.headshot || '',
            stats: {},
          }
        }
        // Save (or override) this stat category for the athlete.
        leaderMap[athleteId].stats[categoryName] = displayValue
      })
    })
    return Object.values(leaderMap)
  }

  // Compute leader cards for home and away.
  const homeLeaderCards = useMemo(() => getLeaderCards(homeTeam), [homeTeam])
  const awayLeaderCards = useMemo(() => getLeaderCards(awayTeam), [awayTeam])

  // Build row data for AG Grid by matching statistics from home and away.
  const rowData = useMemo(() => {
    if (!homeTeam.statistics || !awayTeam.statistics) return []
    const homeMap = {}
    homeTeam.statistics.forEach((stat) => {
      homeMap[stat.name] = stat.displayValue
    })
    const awayMap = {}
    awayTeam.statistics.forEach((stat) => {
      awayMap[stat.name] = stat.displayValue
    })
    const allStatNames = Array.from(
      new Set([
        ...homeTeam.statistics.map((s) => s.name),
        ...awayTeam.statistics.map((s) => s.name),
      ])
    )
    return allStatNames.map((statName) => ({
      statName,
      homeValue: homeMap[statName] || '',
      awayValue: awayMap[statName] || '',
    }))
  }, [homeTeam, awayTeam])

  // Define column definitions for AG Grid.
  const columnDefs = useMemo(() => {
    return [
      { headerName: 'Statistic', field: 'statName', flex: 1 },
      {
        headerName: homeTeam.team?.shortDisplayName || 'Home',
        field: 'homeValue',
        flex: 1,
      },
      {
        headerName: awayTeam.team?.shortDisplayName || 'Away',
        field: 'awayValue',
        flex: 1,
      },
    ]
  }, [homeTeam, awayTeam])

  // Fallback UI if no game or competition data is found.
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
      {/* Scoreboard Header with two sides */}
      <div className={styles.scoreboardHeader}>
        {/* Home Side */}
        <div className={styles.teamSide}>
          <div className={styles.teamScore}>
            {homeTeam.team?.logo && (
              <img
                src={homeTeam.team.logo}
                alt={`${homeTeam.team.displayName} Logo`}
                className={styles.teamLogo}
              />
            )}
            <div className={styles.teamName}>{homeTeam.team?.displayName || 'Home Team'}</div>
            <div className={styles.teamScoreValue}>{homeTeam.score || '-'}</div>
          </div>
          <div className={styles.leaderCards}>
            {homeLeaderCards.map((card, idx) => (
              <div key={idx} className={styles.card}>
                {card.athleteImage && (
                  <img src={card.athleteImage} alt={card.athleteName} className={styles.avatar} />
                )}
                <div className={styles.leaderName}>{card.athleteName}</div>
                {Object.entries(card.stats).map(([cat, value], i) => (
                  <div key={i} className={styles.statLine}>
                    {cat}: {value}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* VS Divider */}
        <div className={styles.vs}>VS</div>

        {/* Away Side */}
        <div className={styles.teamSide}>
          <div className={styles.teamScore}>
            {awayTeam.team?.logo && (
              <img
                src={awayTeam.team.logo}
                alt={`${awayTeam.team.displayName} Logo`}
                className={styles.teamLogo}
              />
            )}
            <div className={styles.teamName}>{awayTeam.team?.displayName || 'Away Team'}</div>
            <div className={styles.teamScoreValue}>{awayTeam.score || '-'}</div>
          </div>
          <div className={styles.leaderCards}>
            {awayLeaderCards.map((card, idx) => (
              <div key={idx} className={styles.card}>
                {card.athleteImage && (
                  <img src={card.athleteImage} alt={card.athleteName} className={styles.avatar} />
                )}
                <div className={styles.leaderName}>{card.athleteName}</div>
                {Object.entries(card.stats).map(([cat, value], i) => (
                  <div key={i} className={styles.statLine}>
                    {cat}: {value}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AG Grid table for game statistics */}
      <div className={styles.statisticsSection}>
        <h3>Game Statistics</h3>
        <div className={`ag-theme-alpine ${styles.gridWrapper}`}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={10}
          />
        </div>
      </div>
    </div>
  )
}

export default PurdueGame
