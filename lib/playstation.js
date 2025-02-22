import {
  exchangeCodeForAccessToken,
  exchangeNpssoForCode,
  getProfileFromUserName,
  getRecentlyPlayedGames,
  getBasicPresence,
} from 'psn-api'

const myNpsso = process.env.PSN_TOKEN

export async function getPlaystation() {
  try {
    // Exchange NPSSO for an access code, then for an access token.
    const accessCode = await exchangeNpssoForCode(myNpsso)
    const authorization = await exchangeCodeForAccessToken(accessCode)
    const accessToken = authorization.accessToken

    // Fire off the three requests in parallel.
    const [profileRes, recentRes, presenceRes] = await Promise.allSettled([
      getProfileFromUserName({ accessToken }, 'me'),
      getRecentlyPlayedGames({ accessToken }, 'me'),
      getBasicPresence({ accessToken }, 'me'),
    ])

    // Ensure the profile request succeeded.
    if (profileRes.status !== 'fulfilled') {
      throw new Error(`Failed to fetch profile: ${profileRes.reason}`)
    }
    // Extract the profile from the response.
    const profile = profileRes.value.profile || {}

    // Process recently played games using a functional (const) approach.
    const recentlyPlayed =
      recentRes.status === 'fulfilled' &&
      recentRes.value.data &&
      recentRes.value.data.gameLibraryTitlesRetrieve &&
      Array.isArray(recentRes.value.data.gameLibraryTitlesRetrieve.games) &&
      recentRes.value.data.gameLibraryTitlesRetrieve.games.length > 0
        ? {
            name: recentRes.value.data.gameLibraryTitlesRetrieve.games[0].name,
            displayImage: recentRes.value.data.gameLibraryTitlesRetrieve.games[0].image
              ? recentRes.value.data.gameLibraryTitlesRetrieve.games[0].image.url
              : '',
          }
        : null

    // Process basic presence.
    const onlineStatus =
      presenceRes.status === 'fulfilled' &&
      presenceRes.value.basicPresence &&
      presenceRes.value.basicPresence.primaryPlatformInfo &&
      typeof presenceRes.value.basicPresence.primaryPlatformInfo.onlineStatus === 'string'
        ? presenceRes.value.basicPresence.primaryPlatformInfo.onlineStatus.toLowerCase() ===
          'online'
        : false

    // Build and return the standardized profile object.
    return {
      gamerTag: profile.onlineId || '',
      gamerScore: profile.trophySummary ? profile.trophySummary.level : '',
      gamerPic:
        profile.avatarUrls && profile.avatarUrls.length > 0 ? profile.avatarUrls[0].avatarUrl : '',
      onlineStatus,
      multiplayerSummary: {}, // PSN doesn't provide this; default to empty object.
      recentlyPlayed,
    }
  } catch (error) {
    console.error(`Failed to fetch PlayStation data: ${error}`)
    throw error
  }
}
