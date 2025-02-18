import React from 'react'
import Image from 'next/image'
import portraitImage from '../../public/static/images/me.webp'

export default function HeroPortrait() {
  return (
    <>
      <Image
        priority
        width={900}
        height={500}
        placeholder="blur"
        src={portraitImage}
        alt="Portrait of Kevin Morales"
        objectFit="cover"
        className="rounded-[16px]"
      />
    </>
  )
}
