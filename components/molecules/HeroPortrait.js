import React from 'react'
import Image from 'next/image'

export default function HeroPortrait() {
  return (
    <Image
      width={900}
      height={500}
      src="/static/images/me.webp"
      alt="Portrait of Kevin Morales"
      objectFit="cover"
      className="rounded-2xl"
      priority
    />
  )
}
