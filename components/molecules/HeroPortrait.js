import React from 'react'
import Image from 'next/image'
import portraitImage from '../../public/static/images/avatar.webp'

export default function HeroPortrait() {
  return (
    <>
      <Image
        priority
        width={600}
        height={424}
        placeholder="blur"
        src={portraitImage}
        alt="Portrait of Kevin Morales"
        objectFit="cover"
        className="rounded-2xl"
      />
    </>
  )
}
