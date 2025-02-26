// Helper to convert a string to camelCase.
export function toCamelCase(str) {
  return str
    .split(/\s+/)
    .map((word, index) => {
      if (index === 0) return word.toLowerCase()
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join('')
}

// Convert an array of statistic objects into a lookup map using camelCase keys.
export function statsArrayToMap(statsArray = []) {
  return statsArray.reduce((map, stat) => {
    const key = toCamelCase(stat.name)
    map[key] = stat.displayValue
    return map
  }, {})
}

// Fetch the ESPN scoreboard for men’s college basketball.
export async function fetchScores() {
  const API_URL =
    'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard'
  const res = await fetch(API_URL)
  if (!res.ok) {
    throw new Error(`Failed to fetch scoreboard data: ${res.statusText}`)
  }
  return res.json()
}

// Given the raw scoreboard data, return the event for the Purdue game (if any).
export async function extractPurdueGame() {
  const scoreData = await fetchScores()
  if (!scoreData || !scoreData.events) return null
  return scoreData.events.find((event) => {
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
