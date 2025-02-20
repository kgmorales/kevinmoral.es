// Extract competition and team details from gameData.
function extractTeams(gameData) {
  const competition = gameData?.competitions?.[0] || {}
  const competitors = competition?.competitors || []
  const homeTeam = competitors[0] || {}
  const awayTeam = competitors[1] || {}
  const isGameLive = competition?.status?.type?.state === 'in'
  return { competition, homeTeam, awayTeam, isGameLive }
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

// Build row data for the statistics table with custom ordering.
function getRowData(homeTeam, awayTeam) {
  if (!homeTeam.statistics || !awayTeam.statistics) return []

  // Create lookup maps for display values.
  const homeMap = {}
  homeTeam.statistics.forEach((stat) => {
    homeMap[stat.name] = stat.displayValue
  })

  const awayMap = {}
  awayTeam.statistics.forEach((stat) => {
    awayMap[stat.name] = stat.displayValue
  })

  // Get a unique set of stat names from both teams.
  const allStatNames = Array.from(
    new Set([...homeTeam.statistics.map((s) => s.name), ...awayTeam.statistics.map((s) => s.name)])
  )

  // Define the desired order: points-related stats first, then rebounds, then the rest.
  const priorityOrder = ['points', 'avgPoints', 'rebounds', 'avgRebounds']

  // Build a sorted array:
  // - First include any stat names in the priorityOrder (in that order)
  // - Then include all other stat names in their original order.
  const sortedStatNames = [
    ...priorityOrder.filter((name) => allStatNames.includes(name)),
    ...allStatNames.filter((name) => !priorityOrder.includes(name)),
  ]

  return sortedStatNames.map((statName) => ({
    statName,
    homeValue: homeMap[statName] || '',
    awayValue: awayMap[statName] || '',
  }))
}

// Define column definitions for the grid.
function getColumnDefs(homeTeam, awayTeam) {
  return [
    { headerName: '', field: 'statName', flex: 1 },
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
}

export { extractTeams, getColumnDefs, getLeaderCards, getRowData }
