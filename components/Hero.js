// components/Hero.js
import React, { useState } from 'react'
import Image from 'next/image'
import portraitImage from '../public/static/images/avatar.jpg'
import SpotifyNowPlaying from './spotify/SpotifyNowPlaying'
import Scoreboard from './purdue/scoreboard/Scoreboard'
import Purdue from './purdue/Purdue'

export default function Hero({ heroData }) {
  const { spotify, purdue } = heroData

  // Only toggle based on the Purdue component click
  const [showScoreboard, setShowScoreboard] = useState(false)
  const toggleScoreboard = () => setShowScoreboard((prev) => !prev)

  return (
    <div className="w-lg mx-auto my-10 flex flex-col gap-10 md:flex-row md:items-stretch">
      {/* Left side: portrait */}
      <div className="flex justify-center md:w-1/2">
        <Image
          src={portraitImage}
          alt="portrait of Kevin Morales"
          className="aspect-square rounded-lg bg-zinc-100 object-cover dark:bg-zinc-800"
        />
      </div>

      {/* Right side: text + sub-components */}
      <div className="flex flex-col justify-between gap-6 self-stretch md:w-1/2">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-gray-800 dark:text-zinc-100 sm:text-5xl">
          Kevin Morales
        </h1>

        <div className="flex min-h-[280px]">
          {showScoreboard ? (
            // When toggled, render the Scoreboard component.
            <Scoreboard purdue={purdue} />
          ) : (
            // Otherwise, show your bio.
            <p className="text-base text-gray-600 dark:text-gray-400">
              I am a Full Stack Engineer with a foundation in Design and User Experience, I
              specialize in refining and optimizing code for maintainability, scalability, and
              reusability. My attention to detail and pattern recognition enhances the efficiency of
              the solutions I design and develop. I've taken projects from conception to deployment
              to maintenance, collaborating with teams of varying sizes. Ensuring that the
              requirements of all Users and stakeholders are addressed.
            </p>
          )}
        </div>
        <div className="flex content-center items-center justify-between gap-2">
          <SpotifyNowPlaying spotify={spotify} />
          {/* The Purdue component will toggle the view when clicked */}
          <Purdue purdue={purdue} isActive={showScoreboard} onToggle={toggleScoreboard} />
        </div>
      </div>
    </div>
  )
}
