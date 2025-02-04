import React, { useState, useEffect } from 'react'
import { statsArrayToMap } from '@/lib/scores/scores'

const GameTable = ({ gameData }) => {
  const [rows, setRows] = useState([])

  // Whenever gameData changes, map its competitors' statistics to row data.
  useEffect(() => {
    if (gameData) {
      // Use the passed-in gameData directly
      const competition = gameData.competitions && gameData.competitions[0]
      if (!competition || !competition.competitors) return

      const dataRows = competition.competitors.map((comp) => {
        // Create a lookup map for the statistics using camelCase keys.
        const statsMap = statsArrayToMap(comp.statistics || [])
        return {
          team: comp.team.abbreviation,
          rebounds: statsMap.rebounds || 'N/A',
          assists: statsMap.assists || 'N/A',
          fgm: statsMap.fieldGoalsMade || 'N/A',
          fga: statsMap.fieldGoalsAttempted || 'N/A',
          fgPct: statsMap.fieldGoalPct || 'N/A',
          threePM: statsMap.threePointFieldGoalsMade || 'N/A',
          threePA: statsMap.threePointFieldGoalsAttempted || 'N/A',
          threePct: statsMap.threePointFieldGoalPct || 'N/A',
          ftPct: statsMap.freeThrowPct || 'N/A',
        }
      })

      setRows(dataRows)
    }
  }, [gameData])

  return (
    <div>
      {gameData ? (
        <div>
          {/* Optionally display a game name/title if available */}
          <table border="1" cellPadding="5" cellSpacing="0">
            <thead>
              <tr>
                <th>Team</th>
                <th>Rebounds</th>
                <th>Assists</th>
                <th>FGM</th>
                <th>FGA</th>
                <th>FG%</th>
                <th>3PM</th>
                <th>3PA</th>
                <th>3P%</th>
                <th>FT%</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>{row.team}</td>
                  <td>{row.rebounds}</td>
                  <td>{row.assists}</td>
                  <td>{row.fgm}</td>
                  <td>{row.fga}</td>
                  <td>{row.fgPct}</td>
                  <td>{row.threePM}</td>
                  <td>{row.threePA}</td>
                  <td>{row.threePct}</td>
                  <td>{row.ftPct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Loading Purdue game data…</p>
      )}
    </div>
  )
}

export default GameTable
