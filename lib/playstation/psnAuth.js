// lib/playstation/psnAuth.js (server-only)
import redisClient from '@/pages/api/redis' // or from a server-only folder

export async function storePSNRefreshToken(refreshToken) {
  try {
    await redisClient.set('psn_refresh_token', refreshToken)
    console.log('PSN refresh token stored successfully.')
  } catch (error) {
    console.error('Error storing PSN refresh token:', error)
  }
}

export async function getPSNRefreshToken() {
  try {
    const token = await redisClient.get('psn_refresh_token')
    return token
  } catch (error) {
    console.error('Error retrieving PSN refresh token:', error)
    return null
  }
}
