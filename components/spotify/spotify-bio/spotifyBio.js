import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import SpotifyLogo from '@/data/logos/spotify.svg'

export default function SpotifyNowPlayingBio({ spotify }) {
  const containerRef = useRef(null)
  const textRef = useRef(null)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [overflowDistance, setOverflowDistance] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (containerRef.current && textRef.current) {
      const diff = textRef.current.scrollWidth - containerRef.current.offsetWidth
      setOverflowDistance(diff)
      setIsOverflowing(diff > 0)
    }
  }, [spotify?.title])

  const containerClass =
    'rounded-2xl border border-neutral-700 bg-themeColor p-4 shadow-[0_1px_1px_rgba(0,0,0,0.1),0_2px_2px_rgba(0,0,0,0.1),0_4px_4px_rgba(0,0,0,0.1),0_8px_8px_rgba(0,0,0,0.1),0_16px_16px_rgba(0,0,0,0.1)]'

  if (!spotify || !spotify.isPlaying) {
    return (
      <AnimatePresence exitBeforeEnter>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={containerClass}>
            <div className="flex flex-col items-center gap-2">
              <iframe
                className="rounded-2xl"
                src="https://open.spotify.com/embed/playlist/0PIc8E5CiFEuIcX3KFaM4D?utm_source=generator&theme=0"
                width="100%"
                height="152"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  const { album, artists, title, href } = spotify

  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={containerClass}>
          <div
            className="absolute bottom-[10px] right-[10px] z-[999] mx-auto h-10 w-10 cursor-pointer bg-themeColor text-center"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
          >
            <SpotifyLogo width={40} height={40} className="cursor-pointer" />
          </div>
          <AnimatePresence exitBeforeEnter>
            {isExpanded ? (
              <motion.div
                key="spotifyPlayer"
                className="mt-4 w-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <iframe
                  className="rounded-2xl text-themeColor shadow-[0_1px_1px_rgba(0,0,0,0.1)]"
                  src="https://open.spotify.com/embed/playlist/0PIc8E5CiFEuIcX3KFaM4D?utm_source=generator&theme=0"
                  width="100%"
                  height="300px"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                ></iframe>
              </motion.div>
            ) : (
              <motion.div
                key="musicContainer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex w-full items-center gap-4"
              >
                <div className="shrink-0">
                  {album?.image?.href && (
                    <Image
                      src={album.image.href}
                      alt={album.name}
                      width={120}
                      height={120}
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex max-w-[200px] flex-col gap-2 overflow-hidden">
                  <Link href={href} legacyBehavior>
                    <a
                      ref={containerRef}
                      className="relative block w-[300px] overflow-hidden whitespace-nowrap text-xl font-bold text-white no-underline"
                    >
                      <span
                        ref={textRef}
                        style={
                          isOverflowing ? { '--overflow-distance': `${overflowDistance}px` } : {}
                        }
                        className={isOverflowing ? 'inline-block animate-marquee' : 'inline-block'}
                      >
                        {title}
                      </span>
                    </a>
                  </Link>
                  <Link href={album?.href || '#'} legacyBehavior>
                    <a className="text-base text-[#aaa] no-underline">{album?.name}</a>
                  </Link>
                  <div className="text-[0.9rem] text-[#ccc]">
                    {artists?.map((artist, index) => (
                      <React.Fragment key={artist.id}>
                        <Link href={artist.href} legacyBehavior>
                          <a className="text-inherit no-underline transition-colors duration-300 hover:text-white">
                            {artist.name}
                          </a>
                        </Link>
                        {index < artists.length - 1 && <span className="mx-[2px]">, </span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
