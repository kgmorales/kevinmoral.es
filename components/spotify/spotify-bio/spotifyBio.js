'use client'
import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './spotifyBio.module.css'
import SpotifyLogo from '@/data/spotify.svg'
const portraitImage = '/static/images/avatar.webp'

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

  // If not playing, show default image and text.
  if (!spotify || !spotify.isPlaying) {
    return (
      <AnimatePresence exitBeforeEnter>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.container}>
            <div className={styles.defaultContent}>
              <Image
                src={portraitImage}
                alt="Chasing these two"
                width={300}
                height={200}
                className={styles.defaultImage}
              />
              <p className={styles.infoText}>Chasing these two</p>
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
        <div className={styles.container}>
          {/* Spotify Logo at bottom-right; clicking toggles the view */}
          <div
            className={styles.spotifyContainer}
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
                className={styles.spotifyPlayerWrapper}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <iframe
                  style={{
                    borderRadius: '16px',
                    color: '#171717',
                    boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)',
                  }}
                  src="https://open.spotify.com/embed/playlist/0PIc8E5CiFEuIcX3KFaM4D?utm_source=generator&theme=0"
                  width="100%"
                  height="352"
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
                className={styles.musicContainer}
              >
                <div className={styles.albumArt}>
                  {album?.image?.href && (
                    <Image
                      src={album.image.href}
                      alt={album.name}
                      width={120}
                      height={120}
                      className={styles.image}
                    />
                  )}
                </div>
                <div className={styles.details}>
                  <Link href={href} legacyBehavior>
                    <a ref={containerRef} className={styles.trackTitleMarquee}>
                      <span
                        ref={textRef}
                        style={
                          isOverflowing ? { '--overflow-distance': `${overflowDistance}px` } : {}
                        }
                        className={isOverflowing ? styles.marqueeText : styles.normalText}
                      >
                        {title}
                      </span>
                    </a>
                  </Link>
                  <Link href={album?.href || '#'} legacyBehavior>
                    <a className={styles.albumName}>{album?.name}</a>
                  </Link>
                  <div className={styles.artists}>
                    {artists?.map((artist, index) => (
                      <React.Fragment key={artist.id}>
                        <Link href={artist.href} legacyBehavior>
                          <a className={styles.artistName}>{artist.name}</a>
                        </Link>
                        {index < artists.length - 1 && <span className={styles.separator}>, </span>}
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

SpotifyNowPlayingBio.propTypes = {
  spotify: PropTypes.shape({
    album: PropTypes.shape({
      name: PropTypes.string,
      href: PropTypes.string,
      image: PropTypes.shape({
        height: PropTypes.number,
        href: PropTypes.string,
        width: PropTypes.number,
      }),
    }),
    artists: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        href: PropTypes.string,
        id: PropTypes.string,
      })
    ),
    href: PropTypes.string,
    isPlaying: PropTypes.bool,
    title: PropTypes.string,
  }),
}
