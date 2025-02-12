// components/Hero.js
import React, { useState } from 'react'
import Image from 'next/image'
import portraitImage from '../../public/static/images/avatar.jpg'
import SpotifyNowPlaying from '@/components/spotify/SpotifyNowPlaying'
import Scoreboard from '@/components/purdue/scoreboard/Scoreboard'
import Purdue from '@/components/purdue/Purdue'
import { IoLogoCodepen, IoLogoGithub, IoLogoLinkedin, IoLogoTwitter, IoMail } from 'react-icons/io5'
import Link from 'next/link'
import Notification from '@/components/atoms/Notification'

const socialLinksData = [
  {
    href: 'https://github.com/kgmorales',
    ariaLabel: 'Check out my Github',
    icon: IoLogoGithub,
  },
  {
    href: 'https://www.linkedin.com/in/kevingmorales/',
    ariaLabel: 'Connect with me on LinkedIn',
    icon: IoLogoLinkedin,
  },
  {
    href: 'https://twitter.com/kevinmoral_es',
    ariaLabel: 'Check out my Twitter',
    icon: IoLogoTwitter,
  },
  {
    href: 'https://codepen.io/kevinmoral_es/',
    ariaLabel: 'Check out my codepen',
    icon: IoLogoCodepen,
  },
]

function SocialLink({ icon: Icon, href, ariaLabel }) {
  return (
    <Link href={href} legacyBehavior>
      <a className="-m-1 p-1" aria-label={ariaLabel}>
        <Icon className="h-10 w-10 cursor-pointer fill-gray-500 transition hover:fill-gray-200" />
      </a>
    </Link>
  )
}

function CopyToClipboard({ icon: Icon, text, ...props }) {
  const [show, setShow] = useState(false)

  const handleClick = () => {
    navigator.clipboard.writeText(text.contact)
    setShow(true)
    setTimeout(() => setShow(false), 3000)
  }

  return (
    <div className="-m-1 p-1" {...props}>
      <Icon
        className="h-10 w-10 cursor-pointer fill-gray-500 transition hover:fill-gray-200"
        onClick={handleClick}
      />
      <Notification show={show} setShow={setShow} text={text} />
    </div>
  )
}

export default function Hero({ heroData }) {
  const { spotify, purdue } = heroData

  // Only toggle based on the Purdue component click
  const [showScoreboard, setShowScoreboard] = useState(false)
  const toggleScoreboard = () => setShowScoreboard((prev) => !prev)

  return (
    <div className="w-lg mx-auto my-10 flex flex-col gap-10 md:flex-row md:items-stretch">
      {/* Left side: portrait */}
      <div className="flex justify-center md:w-1/2 lg:w-3/4">
        <Image
          src={portraitImage}
          alt="portrait of Kevin Morales"
          className="aspect-square rounded-2xl bg-zinc-100 object-cover"
        />
      </div>

      {/* Right side */}
      <div className="flex flex-col justify-between gap-6 self-stretch md:w-1/2">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-gray-800 dark:text-zinc-100 sm:text-5xl">
          Kevin Morales
        </h1>

        <div className="flex min-h-[280px] flex-col">
          {showScoreboard ? (
            // When toggled, render the Scoreboard component.
            <Scoreboard purdue={purdue} />
          ) : (
            // Otherwise, show your bio.
            <>
              <p className="text-base text-gray-600 dark:text-gray-400">
                I am a Full Stack Engineer with a foundation in Design and User Experience, I
                specialize in refining and optimizing code for maintainability, scalability, and
                reusability. My attention to detail and pattern recognition enhances the efficiency
                of the solutions I design and develop. I've taken projects from conception to
                deployment to maintenance, collaborating with teams of varying sizes. Ensuring that
                the requirements of all Users and stakeholders are addressed.
              </p>
            </>
          )}
        </div>
        <div className="flex content-center items-center justify-between gap-4">
          <Purdue isActive={showScoreboard} onToggle={toggleScoreboard} />
          <SpotifyNowPlaying spotify={spotify} />
          {/* The Purdue component will toggle the view when clicked */}
        </div>
        <div className="flex justify-between gap-6 pt-5">
          {socialLinksData.map((link, index) => (
            <SocialLink key={index} href={link.href} aria-label={link.ariaLabel} icon={link.icon} />
          ))}
          <CopyToClipboard
            text={{ contact: 'hello@kevinmoral.es', type: 'Email' }}
            aria-label="Send me an email"
            icon={IoMail}
          />
        </div>
      </div>
    </div>
  )
}
