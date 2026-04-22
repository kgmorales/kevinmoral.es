import React from 'react'

export default function SpotifyNowPlaying({ isActive, onToggle, spotify }) {
  const isPlaying = spotify?.isPlaying

  return (
    <div
      className="flex h-20 w-[90px] cursor-pointer items-center rounded-2xl border border-neutral-700 p-2 shadow-[0_1px_1px_rgba(0,0,0,0.1),0_2px_2px_rgba(0,0,0,0.1),0_4px_4px_rgba(0,0,0,0.1),0_8px_8px_rgba(0,0,0,0.1),0_16px_16px_rgba(0,0,0,0.1)] transition-[width] duration-[400ms] ease-in hover:border-white"
      onClick={(e) => {
        e.stopPropagation()
        onToggle(e)
      }}
    >
      <div className="flex w-[72px] flex-col items-center justify-center">
        <div className="flex h-10 items-end justify-center">
          {isPlaying ? (
            <>
              <div className="mx-[2px] w-[6px] animate-equalizer rounded-[2px] bg-white pb-4 [animation-duration:1.9s]"></div>
              <div className="mx-[2px] w-[6px] animate-equalizer rounded-[2px] bg-white pb-4 [animation-duration:2s]"></div>
              <div className="mx-[2px] w-[6px] animate-equalizer rounded-[2px] bg-white pb-4 [animation-duration:1.7s]"></div>
              <div className="mx-[2px] w-[6px] animate-equalizer rounded-[2px] bg-white pb-4 [animation-duration:2.1s]"></div>
            </>
          ) : (
            <>
              <div className="mx-[2px] h-0 w-[6px] rounded-[2px] bg-[rgb(125,115,115)] pb-[0.2rem]"></div>
              <div className="mx-[2px] h-0 w-[6px] rounded-[2px] bg-[rgb(125,115,115)] pb-[0.2rem]"></div>
              <div className="mx-[2px] h-0 w-[6px] rounded-[2px] bg-[rgb(125,115,115)] pb-[0.2rem]"></div>
              <div className="mx-[2px] h-0 w-[6px] rounded-[2px] bg-[rgb(125,115,115)] pb-[0.2rem]"></div>
            </>
          )}
        </div>
        {isPlaying ? (
          <p className="text-xs text-white">bangers on</p>
        ) : (
          <p className="text-xs text-[rgb(125,115,115)]">bangers off</p>
        )}
      </div>
    </div>
  )
}
