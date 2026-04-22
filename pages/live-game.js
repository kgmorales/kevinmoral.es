import React, { useState, useEffect, useMemo } from 'react'
import ScoreboardLive from '@/components/live-game/scoreboardLive/scoreboardLive'
import Leaders from '@/components/live-game/leader-tabs/leaders'

import { liveData } from '@/data/live-data'
import { extractPurdueGame } from '@/lib/purdue'
import * as utils from '@/lib/purdue/live-game'

const pageClass = 'flex w-full flex-col gap-8 bg-themeColor p-4 text-white'

function PurdueGame() {
  const [gameData, setGameData] = useState(
    liveData?.events?.find((ev) => ev.shortName?.includes('PUR')) || {}
  )

  const { competition, homeTeam, awayTeam, isGameLive } = useMemo(
    () => utils.extractTeams(gameData),
    [gameData]
  )

  useEffect(() => {
    let intervalId
    const fetchLiveData = async () => {
      try {
        const newGameData = await extractPurdueGame()
        if (newGameData) {
          setGameData(newGameData)
        }
      } catch (error) {
        console.error('Error fetching live game data:', error)
      }
    }
    if (isGameLive) {
      fetchLiveData()
      intervalId = setInterval(fetchLiveData, 20000)
    }
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isGameLive])

  const homeLeaderCards = useMemo(() => utils.getLeaderCards(homeTeam), [homeTeam])
  const awayLeaderCards = useMemo(() => utils.getLeaderCards(awayTeam), [awayTeam])

  const rowData = useMemo(() => utils.getRowData(homeTeam, awayTeam), [homeTeam, awayTeam])
  const homeLabel = homeTeam.team?.shortDisplayName || 'Home'
  const awayLabel = awayTeam.team?.shortDisplayName || 'Away'

  if (!gameData.id) {
    return (
      <div className={pageClass}>
        <h2>No Purdue game found!</h2>
      </div>
    )
  }
  if (!competition.uid) {
    return (
      <div className={pageClass}>
        <h2>No competition data.</h2>
      </div>
    )
  }

  return (
    <div className={pageClass}>
      <ScoreboardLive homeTeam={homeTeam} awayTeam={awayTeam} competition={competition} />
      <Leaders homeLeaderCards={homeLeaderCards} awayLeaderCards={awayLeaderCards} />
      <h3 className="mb-4 text-center text-2xl font-semibold text-white">Statistics Table</h3>
      <div className="overflow-x-auto rounded-2xl border border-neutral-700">
        <table className="w-full border-collapse text-left">
          <thead className="bg-themeColor text-white">
            <tr>
              <th className="border-b border-neutral-700 px-4 py-3 text-sm font-semibold"></th>
              <th className="border-b border-neutral-700 px-4 py-3 text-sm font-semibold">
                {homeLabel}
              </th>
              <th className="border-b border-neutral-700 px-4 py-3 text-sm font-semibold">
                {awayLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {rowData.map((row) => (
              <tr key={row.statName} className="odd:bg-themeColor even:bg-neutral-900">
                <td className="px-4 py-2 text-sm">{row.statName}</td>
                <td className="px-4 py-2 text-sm">{row.homeValue}</td>
                <td className="px-4 py-2 text-sm">{row.awayValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PurdueGame
