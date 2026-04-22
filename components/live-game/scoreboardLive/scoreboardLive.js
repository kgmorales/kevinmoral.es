import Live from '@/components/purdue/scoreboard/live/Live'
import Image from 'next/image'

export default function ScoreboardLive({ homeTeam, awayTeam, competition }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-neutral-700 bg-themeColor p-4 shadow-normal md:flex-row md:gap-4 md:px-8">
      {/* Home team — mobile order 2, desktop order 1 */}
      <div className="order-2 mb-4 flex w-full flex-row-reverse items-center justify-between px-4 md:order-1 md:flex-row">
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            {homeTeam.team?.logo && (
              <>
                <Image
                  src={homeTeam.team.logo}
                  alt={homeTeam.team.displayName}
                  width={125}
                  height={125}
                  className="h-[75px] w-[75px] object-cover md:h-[125px] md:w-[125px]"
                />
                <p>#{homeTeam.curatedRank.current}</p>
              </>
            )}
          </div>
          <h2 className="mt-2 text-base font-semibold md:text-xl">{homeTeam.team?.displayName}</h2>
        </div>
        <div className="text-[2.5rem] font-semibold text-white md:text-[4rem]">
          <p className="text-white">{homeTeam.score || 0}</p>
        </div>
      </div>

      {/* Match details — mobile order 1, desktop order 2 */}
      <div className="order-1 mt-4 flex flex-col items-center justify-center gap-[0.2rem] text-center text-white md:order-2 md:mt-0">
        <Live />
        <div className="text-2xl font-semibold text-white md:text-[2rem]">
          {competition?.status?.displayClock || '0:00'}
        </div>
        <span>
          {competition?.status?.period}
          {competition?.status?.period === 1 ? 'st' : 'nd'} Half
        </span>
        <span className="whitespace-nowrap">
          {competition?.venue?.address?.city}, {competition?.venue?.address?.state}
        </span>
      </div>

      {/* Away team — mobile order 3, desktop order 3 */}
      <div className="order-3 mb-4 flex w-full flex-row-reverse items-center justify-between px-4 md:flex-row">
        <div className="text-[2.5rem] font-semibold text-white md:text-[4rem]">
          <p className="text-white">{awayTeam.score || 0}</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            {awayTeam.team?.logo && (
              <>
                <Image
                  src={awayTeam.team.logo}
                  alt={awayTeam.team.displayName}
                  width={125}
                  height={125}
                  className="h-[75px] w-[75px] object-cover md:h-[125px] md:w-[125px]"
                />
                <p>#{awayTeam.curatedRank.current}</p>
              </>
            )}
          </div>
          <h2 className="mt-2 text-base font-semibold md:text-xl">{awayTeam.team?.displayName}</h2>
        </div>
      </div>
    </div>
  )
}
