import React from 'react'
import PurdueLogo from '@/data/logos/logo-purdue.svg'
import PurdueLogoWhite from '@/data/logos/logo-purdue-white.svg'

export default function Purdue({ isActive, onToggle }) {
  return (
    <div
      className="relative h-20 w-20 cursor-pointer rounded-2xl border border-neutral-700 p-2 shadow-[0_1px_1px_rgba(0,0,0,0.1),0_2px_2px_rgba(0,0,0,0.1),0_4px_4px_rgba(0,0,0,0.1),0_8px_8px_rgba(0,0,0,0.1),0_16px_16px_rgba(0,0,0,0.1)] hover:border-white"
      onClick={onToggle}
    >
      <span className="relative z-[9] flex h-full w-full items-center justify-center text-[2em] transition duration-300 ease-in-out">
        {isActive ? <PurdueLogoWhite /> : <PurdueLogo />}
      </span>
    </div>
  )
}
