import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SpotifyLogo from '@/data/spotify.svg'
import styles from './SpotifyNowPlaying.module.css'

export default function SpotifyNowPlaying({ spotify }) {
  const [isOpen, setIsOpen] = useState(false)

  // Basic data
  const isPlaying = spotify?.isPlaying
  const albumArt = spotify?.album?.image?.href
  const rawTitle = spotify?.title || ''
  const title = rawTitle.replace(/\s*(\([^)]*\)|\[[^\]]*\])\s*/g, '').trim()
  const artistName = spotify?.artists?.[0]?.name || ''
  const href = spotify?.href

  // If not playing, show "Currently Chasing Toddlers"
  // If playing, show album + title + artist
  const middleContent = isPlaying ? (
    <div className={styles.details}>
      {albumArt && (
        <div className={styles.albumArt}>
          <Image src={albumArt} alt="album art" width={60} height={60} />
        </div>
      )}
      <div className={styles.textInfo}>
        <p className={styles.title}>{title}</p>
        <p className={styles.artist}>{artistName}</p>
      </div>
    </div>
  ) : (
    <p className={styles.toddlers}>Currently Chasing Toddlers</p>
  )

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <div
      className={`${styles.musicContainer} ${isOpen ? styles.open : styles.collapsed}`}
      onClick={handleToggle}
    >
      {/* Left: Spotify Logo */}
      <div className={styles.logoColumn}>
        <SpotifyLogo />
      </div>

      {/* Middle: hidden by default, slides in on "open" */}
      <div className={styles.middleColumn} onClick={(e) => e.stopPropagation()}>
        {href ? (
          <Link href={href} legacyBehavior passHref>
            <a className={styles.linkWrapper}>{middleContent}</a>
          </Link>
        ) : (
          // If no href, just show the middle content without a link
          middleContent
        )}
      </div>

      {/* Right: wave bars */}
      <div className={styles.waveColumn}>
        <div className={styles.soundwaveContainer}>
          {isPlaying ? (
            <>
              <div className={styles.bar}></div>
              <div className={styles.bar}></div>
              <div className={styles.bar}></div>
              <div className={styles.bar}></div>
            </>
          ) : (
            <>
              <div className={styles.deadBar}></div>
              <div className={styles.deadBar}></div>
              <div className={styles.deadBar}></div>
              <div className={styles.deadBar}></div>
            </>
          )}
        </div>
        <p className="text-xs">bangers {isPlaying ? 'on' : 'off'}</p>
      </div>
    </div>
  )
}
