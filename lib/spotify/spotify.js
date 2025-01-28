// lib/spotify.js
import querystring from 'querystring'

const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played`
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env

const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')

export async function getAccessToken() {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: SPOTIFY_REFRESH_TOKEN, // Proper param name
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get token: ${error}`)
  }

  return response.json() // { access_token, expires_in, scope, token_type, ... }
}

export async function getNowPlaying() {
  const { access_token } = await getAccessToken()

  let response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`Error fetching Now Playing: ${response.status} - ${errorText}`)
  }

  const track = await response.json()

  if (!track.item || !track.is_playing) {
    // If no track is currently playing, fetch the last played track
    console.log('No track is currently playing, fetching the last played track.')
    return getLastPlayedTrack(access_token)
  }

  return formatTrackData(track)
}

async function getLastPlayedTrack(access_token) {
  const response = await fetch(`${RECENTLY_PLAYED_ENDPOINT}?limit=1`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`Error fetching Recently Played: ${response.status} - ${errorText}`)
  }

  const recentTracks = await response.json()
  const lastPlayedTrack = recentTracks.items[0].track

  return formatTrackData({
    item: lastPlayedTrack,
    is_playing: false,
  })
}

function formatTrackData(track) {
  const album = {
    name: track.item.album.name,
    href: track.item.album.external_urls.spotify,
    image: {
      height: track.item.album.images[0].height,
      href: track.item.album.images[0].url,
      width: track.item.album.images[0].width,
    },
  }

  const artists = track.item.artists.map((artist) => ({
    name: artist.name,
    href: artist.external_urls.spotify,
    id: artist.id,
  }))

  const href = track.item.external_urls.spotify
  const isPlaying = track.is_playing
  const title = track.item.name

  return {
    album,
    artists,
    href,
    isPlaying,
    title,
  }
}
