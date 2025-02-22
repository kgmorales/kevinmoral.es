const BASE_URL = 'https://xbl.io/api/v2'
const apiKey = process.env.XBOX_API_KEY

/**
 * Makes a request to the OpenXBL API.
 *
 * @param {string} endpoint - The API endpoint (relative to BASE_URL).
 * @param {string} apiKey - Your App Key to be used in the X-Authorization header.
 * @returns {Promise<Object>} - The parsed JSON response.
 */
async function openXblRequest(endpoint, apiKey) {
  const url = `${BASE_URL}${endpoint}`
  const headers = {
    'X-Authorization': apiKey,
    Accept: 'application/json', // fixed header value
    'Accept-Language': 'en-US',
    'Accept-Encoding': 'gzip, deflate',
  }

  const response = await fetch(url, { headers })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenXBL API error: ${response.status} ${response.statusText} - ${errorText}`)
  }
  return response.json()
}

export async function getXbox() {
  // Fetch both endpoints in parallel using Promise.allSettled.
  const results = await Promise.allSettled([
    openXblRequest('/player/summary', apiKey),
    openXblRequest('/achievements', apiKey),
  ])

  // Check if the requests were successful.
  const playerSummaryResult = results[0]
  const achievementsResult = results[1]

  if (playerSummaryResult.status !== 'fulfilled') {
    throw new Error(`Failed to fetch player summary: ${playerSummaryResult.reason}`)
  }
  if (achievementsResult.status !== 'fulfilled') {
    throw new Error(`Failed to fetch achievements: ${achievementsResult.reason}`)
  }

  // Extract the actual data.
  const playerSummaryData = playerSummaryResult.value
  const achievementsData = achievementsResult.value

  // Extract account data from the player summary.
  const account =
    playerSummaryData.people && playerSummaryData.people.length > 0
      ? playerSummaryData.people[0]
      : {}

  // Extract the first title from the achievements data.
  const recentlyPlayedTitle =
    achievementsData.titles && achievementsData.titles.length > 0
      ? achievementsData.titles[0]
      : null

  // Build the resulting object matching the PSN format.
  const result = {
    gamerTag: account.gamertag || '',
    gamerScore: account.gamerScore || '',
    gamerPic: account.displayPicRaw || '',
    onlineStatus: account.presenceState === 'Online', // renamed property
    multiplayerSummary: account.multiplayerSummary || {},
    recentlyPlayed: recentlyPlayedTitle
      ? {
          name: recentlyPlayedTitle.name,
          displayImage: recentlyPlayedTitle.displayImage,
        }
      : null,
  }

  return result
}
