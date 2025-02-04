// components/Hero.js
import Link from 'next/link'
import { useState } from 'react'
import { IoLogoGithub, IoLogoLinkedin, IoMail, IoLogoCodepen, IoLogoTwitter } from 'react-icons/io5'
import Notification from './Notification'
import Image from 'next/image'
import portraitImage from '../public/static/images/avatar.jpg'
import SpotifyNowPlaying from './spotify/SpotifyNowPlaying'
// Import the scoreboard if you want to render it directly in Hero
import Scoreboard from './purdue/scoreboard/Scoreboard'
import Purdue from './purdue/Purdue'

export default function Hero({ heroData }) {
  const { spotify, purdue } = heroData

  // New state to decide if the scoreboard should be shown instead of the bio
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
          {/* Conditionally render either the bio or the Purdue scoreboard */}
          {showScoreboard ? (
            // Render the scoreboard (you can wrap it with any container and style as needed)
            <Scoreboard purdue={purdue} />
          ) : (
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
        {/* Spotify & Purdue side by side */}
        <div className="flex content-center items-center justify-between gap-2">
          <SpotifyNowPlaying spotify={spotify} />
          {/* Pass the toggle function and current active state as props to Purdue */}
          <Purdue purdue={purdue} isActive={showScoreboard} onToggle={toggleScoreboard} />
        </div>

        {/* Social & Email links */}
        <div className="flex justify-between gap-6">
          <SocialLink
            href="https://github.com/kgmorales"
            aria-label="Check out my Github"
            icon={IoLogoGithub}
          />
          <SocialLink
            href="https://www.linkedin.com/in/kevingmorales/"
            aria-label="Connect with me on LinkedIn"
            icon={IoLogoLinkedin}
          />
          <SocialLink
            href="https://twitter.com/kevinmoral_es"
            aria-label="Check out my Twitter"
            icon={IoLogoTwitter}
          />
          <SocialLink
            href="https://codepen.io/kevinmoral_es/"
            aria-label="Check out my codepen"
            icon={IoLogoCodepen}
          />
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

// The SocialLink and CopyToClipboard components remain unchanged...
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
