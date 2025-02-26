// lib/playstation/playstation.js
import {
  exchangeCodeForAccessToken,
  exchangeNpssoForCode,
  getProfileFromUserName,
  getRecentlyPlayedGames,
  getBasicPresence,
  exchangeRefreshTokenForAuthTokens,
} from 'psn-api'

const myNpsso = process.env.PSN_TOKEN

export async function getPlaystation(providedRefreshToken) {
  try {
    let refreshToken = providedRefreshToken
    let authorization

    if (refreshToken) {
      // Use the provided refresh token to get a new access token.
      authorization = await exchangeRefreshTokenForAuthTokens(refreshToken)
    } else {
      // Perform the full authentication flow.
      const accessCode = await exchangeNpssoForCode(myNpsso)
      authorization = await exchangeCodeForAccessToken(accessCode)
    }

    const accessToken = authorization.accessToken

    // Fire off the three requests in parallel.
    const [profileRes, recentRes, presenceRes] = await Promise.allSettled([
      getProfileFromUserName({ accessToken }, 'me'),
      getRecentlyPlayedGames({ accessToken }, 'me'),
      getBasicPresence({ accessToken }, 'me'),
    ])

    if (profileRes.status !== 'fulfilled') {
      throw new Error(`Failed to fetch profile: ${profileRes.reason}`)
    }
    const profile = profileRes.value.profile || {}

    const recentlyPlayed =
      recentRes.status === 'fulfilled' &&
      recentRes.value.data &&
      recentRes.value.data.gameLibraryTitlesRetrieve &&
      Array.isArray(recentRes.value.data.gameLibraryTitlesRetrieve.games) &&
      recentRes.value.data.gameLibraryTitlesRetrieve.games.length > 0
        ? {
            name: recentRes.value.data.gameLibraryTitlesRetrieve.games[0].name,
            displayImage: recentRes.value.data.gameLibraryTitlesRetrieve.games[0].image?.url || '',
          }
        : null

    const onlineStatus =
      presenceRes.status === 'fulfilled' &&
      presenceRes.value.basicPresence &&
      presenceRes.value.basicPresence.primaryPlatformInfo &&
      typeof presenceRes.value.basicPresence.primaryPlatformInfo.onlineStatus === 'string'
        ? presenceRes.value.basicPresence.primaryPlatformInfo.onlineStatus.toLowerCase() ===
          'online'
        : false

    // Return the standardized profile along with the refresh token (if updated).
    return {
      gamerTag: profile.onlineId || '',
      gamerScore: profile.trophySummary ? profile.trophySummary.level : '',
      gamerPic:
        profile.avatarUrls && profile.avatarUrls.length > 0 ? profile.avatarUrls[0].avatarUrl : '',
      onlineStatus,
      multiplayerSummary: {}, // PSN doesn't provide this; default to empty object.
      recentlyPlayed,
      // Optionally return the new refresh token so the API route can update Redis.
      refreshToken: authorization.refreshToken,
    }
  } catch (error) {
    console.error(`Failed to fetch PlayStation data: ${error}`)
    throw error
  }
}
