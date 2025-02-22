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
  const titleRef = useRef(null)
  const [isOverflowing, setIsOverflowing] = useState(false)

  useEffect(() => {
    if (titleRef.current) {
      setIsOverflowing(titleRef.current.scrollWidth > titleRef.current.offsetWidth)
    }
  }, [spotify?.title])

  // If not playing, show default image and text.
  if (!spotify || !spotify.isPlaying) {
    return (
      <AnimatePresence exitBeforeEnter>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className={styles.container}>
          <div className={styles.spotifyContainer}>
            <SpotifyLogo />
          </div>
          <div className={styles.musicContainer}>
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
                <a className={styles.trackTitleMarquee}>
                  <span
                    ref={titleRef}
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
          </div>
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
