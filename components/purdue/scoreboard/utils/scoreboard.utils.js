const getAbbr = (team) => team?.abbreviation === 'PUR'

const sortForPurdueFirst = (arr) => arr.sort((a, b) => getAbbr(b?.team) - getAbbr(a?.team))

const getViewModel = (competition, live = null) => {
  const gameInformation = {
    date: competition?.status?.type?.shortDetail,
    location: competition?.venue?.fullName,
    address: `${competition?.venue?.address?.city}, ${competition?.venue?.address?.state}`,
    watch: competition?.broadcasts?.[0]?.media?.shortName,
  }

  const competitors = competition?.competitors || []
  const sortedTeams = sortForPurdueFirst([...competitors])
  const teamInfo = sortedTeams.map((team) => {
    const name = team.team.nickname
    // If the team name is "TBD" (ignoring case), then force TBD and remove rank/logo.
    if (name.trim().toLowerCase() === 'tbd') {
      return { name: ' ', rank: '99', logo: null, isTBD: true }
    }
    const rank = team.curatedRank.current
    const logo = team.team.logos?.[0]?.href || null
    return { name, rank, logo, isTBD: false }
  })

  return { gameInformation, teamInfo, live }
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

// (Optional) A helper to extract fake data.
const extractFakeData = (fakeData) => {
  return fakeData.events.find((event) => {
    const competition = event.competitions && event.competitions[0]
    if (!competition || !competition.competitors) return false
    return competition.competitors.some((comp) => {
      return (
        comp.team && comp.team.displayName && comp.team.displayName.toLowerCase().includes('purdue')
      )
    })
  })
}

export { getViewModel, getLiveSelectors, extractFakeData }
