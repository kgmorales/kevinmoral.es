'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Roboto } from 'next/font/google'
import { AnimatePresence, motion } from 'framer-motion'
import { IoLogoCodepen, IoLogoGithub, IoLogoLinkedin, IoLogoTwitter, IoMail } from 'react-icons/io5'
import Notification from '@/components/atoms/Notification'
import HeroPortrait from './HeroPortrait'
import SpotifyNowPlayingBio from '@/components/spotify/spotify-bio/spotifyBio'
import Scoreboard from '@/components/purdue/scoreboard/Scoreboard'
import Purdue from '@/components/purdue/Purdue'
import GamerTabs from '@/components/molecules/gamerTabs/gamerTabs'
import Controller from '@/components/Controller/Controller'
import SpotifyNowPlaying from '../spotify/SpotifyNowPlaying'

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
        <Icon
          alt={ariaLabel}
          className="h-10 w-10 cursor-pointer fill-gray-500 transition hover:fill-gray-200"
        />
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
  const { spotify } = heroData

  // activeView can be "bio", "scoreboard", "gamerTabs", or "spotify"
  const [activeView, setActiveView] = useState('bio')
  const containerRef = useRef(null)

  // When clicking outside the container, revert to bio.
  useEffect(() => {
    function handleOutsideClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveView('bio')
      }
    }
    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [])

  // Toggle functions for interactive controls.
  const togglePurdue = (e) => {
    e.stopPropagation()
    setActiveView((prev) => (prev === 'scoreboard' ? 'bio' : 'scoreboard'))
  }
  const toggleController = (e) => {
    e.stopPropagation()
    setActiveView((prev) => (prev === 'gamerTabs' ? 'bio' : 'gamerTabs'))
  }
  const toggleSpotify = (e) => {
    e.stopPropagation()
    setActiveView((prev) => (prev === 'spotify' ? 'bio' : 'spotify'))
  }

  return (
    <div
      ref={containerRef}
      className="w-lg mx-auto my-10 flex flex-col gap-10 md:flex-row md:items-stretch"
      // onClick here is no longer needed since we listen at document level
    >
      {/* Left side: portrait */}
      <div
        className="relative flex justify-center rounded-[16px] shadow-normal sm:w-full md:w-1/2 lg:w-3/4"
        onClick={(e) => e.stopPropagation()}
      >
        <HeroPortrait />
      </div>

      {/* Right side */}
      <div
        className="flex flex-col justify-between gap-6 self-stretch md:w-1/2"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="font-serif text-4xl font-bold tracking-tight text-gray-800 dark:text-zinc-100 sm:text-5xl">
          Kevin Morales
        </h1>

        {/* Content area with animated transitions */}
        <AnimatePresence exitBeforeEnter>
          <div
            className="flex min-h-[280px] flex-col transition duration-500 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            {activeView === 'scoreboard' ? (
              <Scoreboard />
            ) : activeView === 'gamerTabs' ? (
              <GamerTabs />
            ) : activeView === 'spotify' ? (
              <SpotifyNowPlayingBio spotify={spotify} />
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-base dark:text-gray-400">
                  I am a Full Stack Engineer with a foundation in Design and User Experience, I
                  specialize in refining and optimizing code for maintainability, scalability, and
                  reusability. My attention to detail and pattern recognition enhances the
                  efficiency of the solutions I design and develop. I've taken projects from
                  conception to deployment to maintenance, collaborating with teams of varying
                  sizes. Ensuring that the requirements of all Users and stakeholders are addressed.
                </p>
              </motion.div>
            )}
          </div>
        </AnimatePresence>

        {/* Interactive controls */}
        <div
          className="flex content-center items-center justify-between gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          <Purdue isActive={activeView === 'scoreboard'} onToggle={togglePurdue} />
          <Controller isActive={activeView === 'gamerTabs'} onToggle={toggleController} />
          <SpotifyNowPlaying
            isActive={activeView === 'spotify'}
            onToggle={toggleSpotify}
            spotify={spotify}
          />
        </div>

        {/* Social links and copy-to-clipboard */}
        <div className="flex justify-between gap-6 pt-5" onClick={(e) => e.stopPropagation()}>
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
