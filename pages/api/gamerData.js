// pages/api/gamerData.js
import { getPlaystation } from '@/lib/playstation'
import { getXbox } from '@/lib/xbox'

export default async function handler(req, res) {
  try {
    const psn = await getPlaystation()
    const xbox = await getXbox()

    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=600')
    res.status(200).json({ psn, xbox })
  } catch (error) {
    console.error('Error in API route:', error)
    res.status(500).json({ error: error.message })
  }
}
