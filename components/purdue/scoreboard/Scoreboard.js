import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import Live from './live/Live'
import { Icons } from './consts/icons.constants'
import * as utils from './utils/scoreboard.utils'
import { getPurdue, extractPurdueGame } from '@/lib/purdue'

const skeletonBase = 'animate-pulse bg-[#2c2c2c] rounded'

const Scoreboard = () => {
  const [purdue, setPurdue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [vm, setVm] = useState(null)

  useEffect(() => {
    let isMounted = true
    async function fetchInitialData() {
      try {
        const data = await getPurdue()
        if (isMounted) {
          setPurdue(data)
          const initialCompetition = data?.team?.nextEvent?.[0]?.competitions?.[0] || {}
          setVm(utils.getViewModel(initialCompetition))
          setLoading(false)
        }
      } catch (err) {
        console.error('Error fetching initial Purdue data:', err)
        if (isMounted) {
          setError(err.message)
          setLoading(false)
        }
      }
    }
    fetchInitialData()
    return () => {
      isMounted = false
    }
  }, [])

  const isGameLive = purdue?.team?.nextEvent?.[0]?.competitions?.[0]?.status?.type?.state === 'in'

  const teamInfo = loading ? [{}, {}] : vm?.teamInfo
  const gameInformation = loading ? {} : vm?.gameInformation

  useEffect(() => {
    if (!isGameLive || !vm) return
    let isMounted = true
    let intervalId
    async function fetchLiveData() {
      try {
        const newGameData = await extractPurdueGame()
        if (isMounted && newGameData) {
          const live = utils.getLiveSelectors(newGameData)
          setVm((prevVm) => ({ ...prevVm, live }))
        }
      } catch (error) {
        console.error('Error fetching live game data:', error)
      }
    }
    fetchLiveData()
    intervalId = setInterval(fetchLiveData, 20000)
    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [isGameLive, vm])

  if (error) {
    return <p>Error: {error}</p>
  }

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="relative flex w-full flex-col rounded-2xl border border-neutral-700 bg-themeColor shadow-normal">
          {isGameLive && (
            <div className="absolute left-[72%] top-[7%] -translate-x-1/2 -translate-y-1/2">
              {loading || !vm?.live ? (
                <div className={`${skeletonBase} h-[60px] w-[60px] rounded-full`}></div>
              ) : (
                <Live time={vm.live.time} />
              )}
            </div>
          )}

          <div className="flex flex-col">
            {teamInfo.map((team, index) => (
              <React.Fragment key={index}>
                {isGameLive ? (
                  <div className="absolute left-[115px] top-[77px] w-full">
                    <p>VS</p>
                  </div>
                ) : (
                  <div className="absolute left-[115px] top-[65px] w-full">
                    <p>VS</p>
                  </div>
                )}
                <div className="flex w-full items-center gap-2 border-b border-neutral-700 p-2 text-[20pt] text-white">
                  {loading || !team.name ? (
                    <div className={`${skeletonBase} h-[60px] w-[60px] rounded-full`}></div>
                  ) : team.isTBD ? (
                    <div>TBD</div>
                  ) : team.logo ? (
                    <Image src={team.logo} alt={`${team.name} logo`} width={60} height={60} />
                  ) : null}
                  <div className="flex shrink-0 justify-center tracking-[2px]">
                    {loading || !team.name ? (
                      <div className={`${skeletonBase} h-5 w-[120px]`}></div>
                    ) : (
                      team.name
                    )}
                  </div>
                  <span className="mb-4 text-base">
                    {loading ? (
                      <div className={`${skeletonBase} h-5 w-10`}></div>
                    ) : (
                      Number(team.rank) < 25 && `#${team.rank}`
                    )}
                  </span>
                  {isGameLive &&
                    (loading || !vm?.live ? (
                      <div className={`${skeletonBase} h-5 w-[50px]`}></div>
                    ) : (
                      <h6 className="ml-auto p-4">{vm.live.scores[index]}</h6>
                    ))}
                </div>
              </React.Fragment>
            ))}
          </div>

          <div className="flex h-full flex-row">
            <div className="flex flex-col items-center justify-start gap-2 rounded-bl-2xl border-r border-neutral-700 p-2 text-center">
              {Icons.Address}
              {loading ? (
                <span className={`${skeletonBase} h-5 w-[120px]`}></span>
              ) : (
                <p>{gameInformation.address}</p>
              )}
            </div>
            <div className="flex flex-col items-start justify-start gap-2 rounded-l-2xl bg-themeColor p-2 text-center">
              <p className="flex flex-row justify-start">
                {Icons.Watch} :{' '}
                {loading ? (
                  <span className={`${skeletonBase} h-5 w-[120px]`}></span>
                ) : (
                  `${gameInformation.watch}`
                )}
              </p>
              {!isGameLive && (
                <p className="flex flex-row justify-start">
                  {Icons.Calendar} :{' '}
                  {loading ? (
                    <span className={`${skeletonBase} h-5 w-[120px]`}></span>
                  ) : (
                    `${gameInformation.date}`
                  )}
                </p>
              )}
              {isGameLive && vm?.live && (
                <p className="flex flex-row justify-start">
                  {Icons.Time} :{' '}
                  {loading ? (
                    <span className={`${skeletonBase} h-5 w-[120px]`}></span>
                  ) : (
                    `${vm.live.time}`
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Scoreboard
