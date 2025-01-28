import { getNowPlaying } from '@/lib/spotify/spotify'

export default async function handler(req, res) {
  try {
    const track = await getNowPlaying()
    return res.status(200).json(track)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message })
  }
}
