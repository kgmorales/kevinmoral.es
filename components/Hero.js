import Link from 'next/link'
import { useState } from 'react'
import { IoLogoGithub, IoLogoLinkedin, IoMail, IoLogoCodepen, IoLogoTwitter } from 'react-icons/io5'
import Notification from './Notification'
import Image from 'next/image'
import portraitImage from '../public/static/images/avatar.jpg'

function SocialLink({ icon: Icon, href, ariaLabel }) {
  return (
    <Link href={href}>
      <a className="-m-1 p-1 " aria-label={ariaLabel}>
        <Icon className="h-10 w-10 cursor-pointer fill-gray-500 transition hover:fill-gray-200" />
      </a>
    </Link>
  )
}

function CopyToClipboard({ icon: Icon, text, ...props }) {
  const [show, setShow] = useState(false)

  const handleClick = () => {
    navigator.clipboard.writeText(text.contact)
    setShow(!show)

    setTimeout(() => {
      setShow(false)
    }, 3000)
  }

  return (
    <div className="-m-1 p-1 " {...props}>
      <Icon
        className="h-10 w-10 cursor-pointer fill-gray-500 transition hover:fill-gray-200"
        onClick={handleClick}
      />
      <Notification show={show} setShow={setShow} text={text} />
    </div>
  )
}

export default function Hero() {
  return (
    <div className="w-md mx-auto my-10 flex flex-row gap-6">
      <Image
        src={portraitImage}
        alt="portrait of Kevin Morales"
        className="aspect-square rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
      />
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-800 dark:text-zinc-100 sm:text-5xl">
          Kevin Morales
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-400">
          I am a Front End Engineer with a background in Design and User Experience. My attention to
          detail and pattern recognition allows me to optimize complex code into maintainable,
          scalable, and reusable architecture. I have successfully completed projects from
          brainstorm to production in teams of all sizes ensuring all stakeholder and user needs
          have been met.
        </p>
        <div className="flex justify-between gap-6">
          <SocialLink
            href="https://github.com/kgmorales"
            aria-label="Check out my Github"
            icon={IoLogoGithub}
          />
          <SocialLink
            href="https://www.linkedin.com/in/kgmorales/"
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
