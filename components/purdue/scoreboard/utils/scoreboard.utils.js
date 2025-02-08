// --- Helper Functions for Selectors and Sorting ---

const getAbbr = (team) => team?.abbreviation === 'PUR'

const sortForPurdueFirst = (arr) => arr.sort((a, b) => getAbbr(b?.team) - getAbbr(a?.team))

/**
 * getViewModel builds a view model (vm) from the competition data.
 * It returns an object with:
 * - gameInformation: address, date, location, and broadcast watch info.
 * - teamInfo: an array of team objects (name, rank, logo).
 * - live: optional live data (default is null).
 */
const getViewModel = (competition, live = null) => {
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

const extractFakeData = (fakeData) => {
  return fakeData.events.find((event) => {
    // Assume the first competition in the event is the primary one.
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
