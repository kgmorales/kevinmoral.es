'use client'
import React, { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import styles from './live-game.module.css'

// Register AG Grid modules for v33+
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
ModuleRegistry.registerModules([AllCommunityModule])

// Dynamically import AgGridReact to avoid SSR issues:
const AgGridReact = dynamic(() => import('ag-grid-react').then((mod) => mod.AgGridReact), {
  ssr: false,
})

// Import initial live data and the extractor function:
import { liveData } from '@/data/live-data'
import { extractPurdueGame } from '@/lib/scores/scores'
import Live from '@/components/purdue/scoreboard/live/Live'

// --- MUI Components for Tabs ---
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Image from 'next/image'

// A11y helper for Tabs:
function a11yProps(index) {
  return {
    id: `leader-tab-${index}`,
    'aria-controls': `leader-tabpanel-${index}`,
  }
}

// LeaderBio component – renders the athlete’s bio card in the style of your static example.
function LeaderBio({ leader }) {
  const position = leader.athlete?.position?.abbreviation || ''
  const playerNumber = leader.athlete?.jersey || ''
  return (
    <div className={styles.player}>
      <div className={styles.playerInfo}>
        <h2 className={styles.playerName}>{leader.athleteName}</h2>
        <dl className={styles.playerStats}>
          {Object.entries(leader.stats).map(([stat, value]) => (
            <div key={stat}>
              <dt className={styles.playerStat}>{stat}</dt>
              <dd className={styles.playerStatNumber}>
                {Array.isArray(value) ? value.join(', ') : value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className={styles.playerImage}>
        {playerNumber && <span className={styles.playerNumber}>#{playerNumber}</span>}
        {position && <span className={styles.badge}>{position}</span>}
        <Image src={leader.athleteImage} alt={leader.athleteName} width={150} height={150} />
      </div>
    </div>
  )
}

// LeaderTabsHorizontal renders a set of MUI Tabs – one tab per leader.
function LeaderTabsHorizontal({ leaders }) {
  const [value, setValue] = useState(0)
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  if (!leaders || leaders.length === 0) {
    return <Typography>No leaders available</Typography>
  }
  return (
    <Box className={styles.leaderTabsContainer}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="Leader Tabs"
        variant="scrollable"
        scrollButtons="auto"
        className={styles.tabs}
        TabIndicatorProps={{ style: { backgroundColor: 'rgb(64, 64, 64)' } }}
      >
        {leaders.map((leader, index) => (
          <Tab
            key={index}
            icon={
              <Avatar
                alt={leader.athleteName}
                src={leader.athleteImage}
                className={styles.tabAvatar}
              />
            }
            {...a11yProps(index)}
          />
        ))}
      </Tabs>
      {leaders.map((leader, index) => (
        <div
          role="tabpanel"
          hidden={value !== index}
          id={`leader-tabpanel-${index}`}
          aria-labelledby={`leader-tab-${index}`}
          key={index}
          className={styles.leaderTabPanel}
        >
          {value === index && (
            <Box className={styles.bioContainer}>
              <LeaderBio leader={leader} />
            </Box>
          )}
        </div>
      ))}
    </Box>
  )
}

// Helper: getLeaderCards – aggregates leader data for a competitor.
// Filters out any category named "rating" (case-insensitive) and merges duplicate entries.
function getLeaderCards(competitor) {
  if (!competitor?.leaders) return []
  const filteredCategories = competitor.leaders.filter((catObj) => {
    const catName = catObj.displayName || catObj.name
    return catName.toLowerCase() !== 'rating'
  })
  const flattened = filteredCategories.flatMap((catObj) =>
    (catObj.leaders || []).map((ld) => ({
      category: catObj.displayName || catObj.name,
      athlete: ld.athlete,
      displayValue: ld.displayValue,
    }))
  )
  const leaderMap = flattened.reduce((acc, { category, athlete, displayValue }) => {
    if (!athlete) return acc
    const id = athlete.id
    const prevStats = (acc[id] && acc[id].stats) || {}
    const newValue =
      prevStats[category] !== undefined
        ? Array.isArray(prevStats[category])
          ? [...prevStats[category], displayValue]
          : [prevStats[category], displayValue]
        : displayValue
    return {
      ...acc,
      [id]: {
        teamName: competitor.team?.displayName || 'Unknown Team',
        athleteName: athlete.displayName || 'Unknown',
        athleteImage: athlete.headshot || '',
        athlete, // keep the whole athlete for additional info (like position)
        stats: { ...prevStats, [category]: newValue },
      },
    }
  }, {})
  return Object.values(leaderMap)
}

function PurdueGame() {
  // Set game data initially from the constant liveData.
  const [gameData, setGameData] = useState(
    liveData?.events?.find((ev) => ev.shortName?.includes('PUR')) || {}
  )

  // Compute competition, competitors, and teams.
  const competition = useMemo(() => gameData?.competitions?.[0] || {}, [gameData])
  const competitors = useMemo(() => competition?.competitors || [], [competition])
  const homeTeam = useMemo(() => competitors[0] || {}, [competitors])
  const awayTeam = useMemo(() => competitors[1] || {}, [competitors])
  const isGameLive = competition?.status?.type?.state === 'in'

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

  const homeLeaderCards = useMemo(() => getLeaderCards(homeTeam), [homeTeam])
  const awayLeaderCards = useMemo(() => getLeaderCards(awayTeam), [awayTeam])
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
  const columnDefs = useMemo(
    () => [
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
    ],
    [homeTeam, awayTeam]
  )

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
      {/* Scoreboard / Status Table */}
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

      {/* Two side-by-side horizontal leader tab sections */}
      <h2 className={styles.gameLeaders}>Game Leaders</h2>
      <div className={styles.leaderSection}>
        <div className={styles.leaderColumn}>
          <LeaderTabsHorizontal leaders={homeLeaderCards} />
        </div>
        <div className={styles.leaderColumn}>
          <LeaderTabsHorizontal leaders={awayLeaderCards} />
        </div>
      </div>

      {/* AG Grid Table for game statistics */}
      <h3 className={styles.tableHeading}>Statistics Table</h3>
      <div className={`ag-theme-alpine ${styles.gridWrapper}`}>
        <AgGridReact rowData={rowData} columnDefs={columnDefs} pagination paginationPageSize={10} />
      </div>
    </div>
  )
}

export default PurdueGame
