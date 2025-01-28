export default async function callback(req, res) {
  const code = req.query.code || null
  const error = req.query.error || null

  if (error) {
    // Spotify returned an error; handle it
    return res.status(400).json({ error: 'Spotify authorization error', details: error })
  }

  if (!code) {
    return res.status(400).json({ error: 'No code returned from Spotify' })
  }

  try {
    const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } = process.env

    // Exchange code for an access token + refresh token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // Basic Auth with client_id:client_secret in base64
        Authorization:
          'Basic ' +
          Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
      }),
    })

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text()
      throw new Error(`Token request failed: ${errText}`)
    }

    const tokenData = await tokenResponse.json()
    // tokenData should have { access_token, refresh_token, expires_in, token_type, scope }

    // Typically, you’d store these in a secure cookie or session
    // For demonstration, just returning them as JSON (not recommended in production!)
    // If using next-auth or a session library, store them properly there.
    return res.status(200).json({
      message: 'Tokens received successfully',
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
    })
  } catch (err) {
    console.error('Spotify callback error:', err)
    return res.status(500).json({ error: err.message })
  }
}
