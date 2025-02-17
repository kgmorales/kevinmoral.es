import React from 'react'
import Image from 'next/image'
import portraitImage from '../../public/static/images/avatar.jpg'

export default function HeroPortrait() {
  return (
    <Image
      priority
      src={portraitImage}
      alt="Portrait of Kevin Morales"
      objectFit="cover"
      className="rounded-2xl bg-zinc-100"
    />
  )
}
