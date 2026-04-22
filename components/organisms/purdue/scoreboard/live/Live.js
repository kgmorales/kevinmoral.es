import React from 'react'

export default function Live() {
  return (
    <div className="block">
      <span className="flex rounded-md bg-[#ea2429] px-[7px] py-[6px] font-sans font-bold uppercase text-white">
        <div
          className="mr-[5px] mt-[3px] inline-block h-[15px] w-[15px] animate-blinker rounded-2xl bg-white"
          aria-hidden="true"
        ></div>
        Live
      </span>
    </div>
  )
}
