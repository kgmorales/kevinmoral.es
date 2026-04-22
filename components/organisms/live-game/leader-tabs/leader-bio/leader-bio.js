import Image from 'next/image'

export default function LeaderBio({ leader }) {
  const position = leader.athlete?.position?.abbreviation || ''
  const playerNumber = leader.athlete?.jersey || ''
  return (
    <div className="relative flex w-full max-[700px]:flex-col-reverse max-[700px]:justify-center max-[700px]:text-center">
      <div className="relative flex flex-1 flex-col gap-4 max-[700px]:items-center max-[700px]:justify-center max-[700px]:text-center">
        <h2 className="m-0 text-left text-[1.4rem] font-black text-white">{leader.athleteName}</h2>
        <dl className="flex w-full justify-between rounded-2xl border border-neutral-700 p-4 shadow-[15px_15px_30px_rgba(58,20,31,0.1)]">
          {Object.entries(leader.stats).map(([stat, value]) => (
            <div key={stat}>
              <dt className="text-xs uppercase text-white">{stat}</dt>
              <dd className="mt-[0.375rem] text-2xl font-bold text-white">
                {Array.isArray(value) ? value.join(', ') : value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="relative w-[200px] shrink-0 overflow-hidden max-[700px]:w-full [&_img]:bottom-0 [&_img]:w-[400px] [&_img]:object-cover">
        {playerNumber && (
          <span className="absolute right-6 top-0 flex items-center justify-center text-2xl font-black text-neutral-700 shadow-[3px_5px_10px_0_rgba(58,20,31,0.15)]">
            #{playerNumber}
          </span>
        )}
        {position && (
          <span className="absolute right-6 top-8 flex items-center justify-center text-[1.2rem] font-black text-neutral-700 shadow-[3px_5px_10px_0_rgba(58,20,31,0.15)]">
            {position}
          </span>
        )}
        <Image src={leader.athleteImage} alt={leader.athleteName} width={150} height={150} />
      </div>
    </div>
  )
}
