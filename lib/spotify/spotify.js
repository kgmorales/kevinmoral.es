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

// In-memory cache for the token
let cachedToken = null
let tokenExpiresAt = 0

/**
 * Get an access token from Spotify using your refresh token.
 * Returns null if there's any error.
 */
export async function getAccessToken() {
  const now = Date.now()

  // If token exists and hasn't expired (minus a small buffer), reuse it.
  if (cachedToken && now < tokenExpiresAt - 60000) {
    return cachedToken
  }

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

    const tokenData = await response.json()
    // Cache the token and set expiration time (use a buffer of 60 seconds)
    cachedToken = tokenData.access_token
    tokenExpiresAt = now + tokenData.expires_in * 1000
    return cachedToken
  } catch (err) {
    console.error('Unexpected error getting Spotify token:', err)
    return null
  }
}

/**
 * Fetch the "Now Playing" track. If there's nothing playing, fallback to last played.
 * Returns null if any error occurs.
 */
export async function getNowPlaying() {
  const accessToken = await getAccessToken()
  if (!accessToken) {
    console.error('No access token available, skipping getNowPlaying.')
    return null
  }

  try {
    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (response.status === 204 || response.status === 404) {
      console.log(`Spotify returned ${response.status}. No item playing.`)
      return getLastPlayedTrack(accessToken)
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

    const track = await response.json().catch((parseError) => {
      console.error('Failed to parse Now Playing JSON:', parseError)
      return null
    })

    if (!track?.item || !track.is_playing) {
      console.log('No track is currently playing, fetching last played track.')
      return getLastPlayedTrack(accessToken)
    }

    return formatTrackData(track)
  } catch (err) {
    console.error('Unexpected error in getNowPlaying:', err)
    return null
  }
}

/**
 * Fetch the last played track if nothing is playing.
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

    const recentTracks = await response.json().catch((parseError) => {
      console.error('Failed to parse Recently Played JSON:', parseError)
      return null
    })

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
 * Format Spotify’s track JSON into a simpler shape.
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
