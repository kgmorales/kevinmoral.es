import redis from '@/lib/redis'
import { getPlaystation, getXbox } from '@/lib/gaming'

export default async function handler(req, res) {
  try {
    // Retrieve the stored PSN refresh token from Redis.
    const psnRefreshToken = await redis.get('psn_refresh_token')

    // Run both requests in parallel.
    const results = await Promise.allSettled([getPlaystation(psnRefreshToken), getXbox()])

    const psn =
      results[0].status === 'fulfilled'
        ? results[0].value
        : { error: `Failed to fetch PSN data: ${results[0].reason}` }
    const xbox =
      results[1].status === 'fulfilled'
        ? results[1].value
        : { error: `Failed to fetch Xbox data: ${results[1].reason}` }

    // If the PSN call returned a new refresh token, store it in Redis.
    if (psn.refreshToken) {
      await redis.setex('psn_refresh_token', 300, psn.refreshToken)
    }

    // Build the gamer data.
    const gamerData = { psn, xbox }

    // Cache the aggregated gamer data in Redis for 5 minutes.
    await redis.setex('gamerData', 300, JSON.stringify(gamerData))

    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=600')
    res.status(200).json(gamerData)
  } catch (error) {
    console.error('Error in API route:', error)
    res.status(500).json({ error: error.message })
  }
}
