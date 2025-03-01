// lib/spotify/spotify.js
import querystring from 'querystring'

const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing'
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played'
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env

// Base64-encode client_id + client_secret
const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`, 'utf-8').toString(
  'base64'
)

/**
 * Get an access token from Spotify using your personal refresh token.
 * Returns null if there's any error or if rate-limited, etc.
 */
export async function getAccessToken() {
  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: SPOTIFY_REFRESH_TOKEN,
      }),
    })

    if (!response.ok) {
      const status = response.status
      const errorText = await response.text()
      console.error(`Error fetching token ${status}: ${errorText}`)

      if (status === 429) {
        const retryAfter = response.headers.get('Retry-After')
        console.log(`Rate-limited retrieving token. Retry after ${retryAfter} seconds.`)
      }
      return null
    }

    // Attempt to parse JSON
    let tokenData
    try {
      tokenData = await response.json()
    } catch (parseError) {
      console.error('Failed to parse token JSON:', parseError)
      return null
    }

    // tokenData = { access_token, expires_in, token_type, scope, ... }
    return tokenData
  } catch (err) {
    console.error('Unexpected error getting Spotify token:', err)
    return null
  }
}

/**
 * Fetch the "Now Playing" track. If there's nothing playing, fallback to last played.
 * Returns null if any error or no track is found.
 */
export async function getNowPlaying() {
  const tokenData = await getAccessToken()
  if (!tokenData?.access_token) {
    console.error('No access token available, skipping getNowPlaying.')
    return null
  }

  try {
    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    // If Spotify returns 204 or 404, there's no JSON body
    if (response.status === 204 || response.status === 404) {
      console.log(`Spotify returned ${response.status}. No item playing.`)
      return getLastPlayedTrack(tokenData.access_token)
    }

    if (!response.ok) {
      const status = response.status
      const errorText = await response.text()
      console.error(`Error fetching Now Playing ${status}: ${errorText}`)
      if (status === 429) {
        const retryAfter = response.headers.get('Retry-After')
        console.log(`Rate-limited by Spotify. Retry after: ${retryAfter} seconds.`)
      }
      return null
    }

    let track
    try {
      track = await response.json()
    } catch (parseError) {
      console.error('Failed to parse Now Playing JSON:', parseError)
      return null
    }

    if (!track?.item || !track.is_playing) {
      console.log('No track is currently playing, fetching last played track.')
      return getLastPlayedTrack(tokenData.access_token)
    }

    return formatTrackData(track)
  } catch (err) {
    console.error('Unexpected error in getNowPlaying:', err)
    return null
  }
}

/**
 * If nothing is playing, fetch the last played track. Returns null if any error.
 */
async function getLastPlayedTrack(accessToken) {
  try {
    const response = await fetch(`${RECENTLY_PLAYED_ENDPOINT}?limit=1`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (response.status === 204 || response.status === 404) {
      console.log(`Spotify returned ${response.status}. No recent tracks.`)
      return null
    }

    if (!response.ok) {
      const status = response.status
      const errorText = await response.text()
      console.error(`Error fetching Recently Played ${status}: ${errorText}`)
      if (status === 429) {
        const retryAfter = response.headers.get('Retry-After')
        console.log(`Rate-limited by Spotify. Retry after: ${retryAfter} seconds.`)
      }
      return null
    }

    let recentTracks
    try {
      recentTracks = await response.json()
    } catch (parseError) {
      console.error('Failed to parse Recently Played JSON:', parseError)
      return null
    }

    if (!recentTracks?.items?.length) {
      console.error('No recent tracks found.')
      return null
    }

    const lastPlayedTrack = recentTracks.items[0].track
    return formatTrackData({
      item: lastPlayedTrack,
      is_playing: false,
    })
  } catch (err) {
    console.error('Unexpected error in getLastPlayedTrack:', err)
    return null
  }
}

/**
 * Convert Spotify’s track JSON into a simpler shape for the front end.
 */
function formatTrackData(track) {
  const albumImages = track.item.album.images || []
  const firstImage = albumImages[0] || {}

  return {
    album: {
      name: track.item.album.name,
      href: track.item.album.external_urls.spotify,
      image: {
        height: firstImage.height || 0,
        href: firstImage.url || '',
        width: firstImage.width || 0,
      },
    },
    artists: track.item.artists.map((artist) => ({
      name: artist.name,
      href: artist.external_urls.spotify,
      id: artist.id,
    })),
    href: track.item.external_urls.spotify,
    isPlaying: track.is_playing,
    title: track.item.name,
  }
}
