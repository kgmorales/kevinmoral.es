// lib/spotify/spotify.js
import querystring from 'querystring'

const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing'
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played'
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env

// Basic auth
const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')

// get token
export async function getAccessToken() {
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
    const error = await response.text()
    console.error('Error fetching token:', error)
    throw new Error(`Failed to get token: ${error}`)
  }

  return response.json() // { access_token, ... }
}

export async function getNowPlaying() {
  const { access_token } = await getAccessToken()

  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`Error fetching Now Playing: ${response.status} - ${errorText}`)
    throw new Error(`Now Playing returned ${response.status}: ${errorText}`)
  }

  const track = await response.json()

  // If no track is playing, fallback
  if (!track?.item || !track.is_playing) {
    console.log('No track is currently playing. Fetching last played track.')
    return getLastPlayedTrack(access_token)
  }

  return formatTrackData(track)
}

async function getLastPlayedTrack(access_token) {
  const response = await fetch(`${RECENTLY_PLAYED_ENDPOINT}?limit=1`, {
    headers: { Authorization: `Bearer ${access_token}` },
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`Error fetching Recently Played: ${response.status} - ${errorText}`)
    throw new Error(`Recently Played returned ${response.status}: ${errorText}`)
  }

  const recentTracks = await response.json()
  if (!recentTracks?.items?.length) {
    console.error('No recent tracks found.')
    return null // or return a fallback
  }

  const lastPlayedTrack = recentTracks.items[0].track
  return formatTrackData({ item: lastPlayedTrack, is_playing: false })
}

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
