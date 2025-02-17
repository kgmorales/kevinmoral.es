'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import PropTypes from 'prop-types'

const YoutubeEmbed = ({ embedId }) => {
  const [loaded, setLoaded] = useState(false)
  const thumbnail = `https://img.youtube.com/vi/${embedId}/hqdefault.jpg`

  return (
    <div className="relative aspect-[16/9]">
      {!loaded ? (
        <div className="absolute inset-0 cursor-pointer" onClick={() => setLoaded(true)}>
          <Image
            src={thumbnail}
            alt="YouTube video thumbnail"
            layout="fill"
            objectFit="cover"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              className="rounded-full bg-black bg-opacity-50 p-4"
              aria-label="youtube plaay button"
            >
              <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${embedId}?autoplay=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded YouTube"
        />
      )}
    </div>
  )
}

YoutubeEmbed.propTypes = {
  embedId: PropTypes.string.isRequired,
}

export default YoutubeEmbed
